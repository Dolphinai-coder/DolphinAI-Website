"""
Dolphin AI API
- Smart spend classifier (Layer 1: recommendations, Layer 3: GPT-4o-mini)
- Auth: signup / login stored in Azure SQL (Azure AD token auth)
"""
import os
import json
import asyncio
import httpx
import pymssql
import bcrypt
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import AsyncOpenAI
from difflib import get_close_matches
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY   = os.getenv("OPENAI_API_KEY", "")
AZURE_SQL_SERVER = os.getenv("AZURE_SQL_SERVER", "spendanalyticsserver.database.windows.net")
AZURE_SQL_DB     = os.getenv("AZURE_SQL_DATABASE", "Spend-Analytics")
AZURE_SQL_USER   = os.getenv("AZURE_SQL_USER", "")   # set on Railway; empty = use Azure AD
AZURE_SQL_PASS   = os.getenv("AZURE_SQL_PASS", "")

RESEND_API_KEY   = os.getenv("RESEND_API_KEY", "")
FROM_EMAIL       = os.getenv("FROM_EMAIL", "Dolphin AI <info@dolphinaipro.com>")
NOTIFY_EMAIL     = os.getenv("NOTIFY_EMAIL", "raja.essahri@dolphinaipro.com")

client = AsyncOpenAI(api_key=OPENAI_API_KEY)

app = FastAPI(title="Dolphin AI")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Azure SQL connection (pymssql — no ODBC driver needed) ───────────────────

def get_db():
    return pymssql.connect(
        server=AZURE_SQL_SERVER,
        user=AZURE_SQL_USER,
        password=AZURE_SQL_PASS,
        database=AZURE_SQL_DB,
        tds_version='7.4',
    )


# ─── Create Users table on startup ────────────────────────────────────────────

@app.on_event("startup")
async def init_db():
    try:
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            IF NOT EXISTS (
                SELECT * FROM sys.objects
                WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type = N'U'
            )
            BEGIN
                CREATE TABLE dbo.Users (
                    id            INT IDENTITY(1,1) PRIMARY KEY,
                    full_name     NVARCHAR(100) NOT NULL,
                    company       NVARCHAR(100),
                    email         NVARCHAR(255) NOT NULL,
                    password_hash NVARCHAR(255) NOT NULL,
                    created_at    DATETIME2 DEFAULT GETUTCDATE(),
                    CONSTRAINT UQ_Users_Email UNIQUE (email)
                )
            END
        """)
        cursor.execute("""
            IF NOT EXISTS (
                SELECT * FROM sys.objects
                WHERE object_id = OBJECT_ID(N'[dbo].[DemoRequests]') AND type = N'U'
            )
            BEGIN
                CREATE TABLE dbo.DemoRequests (
                    id           INT IDENTITY(1,1) PRIMARY KEY,
                    first_name   NVARCHAR(100) NOT NULL,
                    last_name    NVARCHAR(100) NOT NULL,
                    email        NVARCHAR(255) NOT NULL,
                    company      NVARCHAR(150) NOT NULL,
                    role         NVARCHAR(100),
                    company_size NVARCHAR(50),
                    annual_spend NVARCHAR(50),
                    message      NVARCHAR(1000),
                    submitted_at DATETIME2 DEFAULT GETUTCDATE()
                )
            END
        """)
        conn.commit()
        conn.close()
        print("✓ Users + DemoRequests tables ready")
    except Exception as e:
        print(f"⚠ DB init: {e}")


# ─── Auth models ───────────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    full_name: str
    company:   str = ""
    email:     str
    password:  str

class LoginRequest(BaseModel):
    email:    str
    password: str


# ─── Signup ────────────────────────────────────────────────────────────────────

@app.post("/api/auth/signup")
async def signup(req: SignupRequest):
    if not req.full_name or not req.email or not req.password:
        return {"error": "Please fill in all required fields."}
    if len(req.password) < 8:
        return {"error": "Password must be at least 8 characters."}
    try:
        conn   = get_db()
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM dbo.Users WHERE email = %s", (req.email.lower(),))
        if cursor.fetchone():
            conn.close()
            return {"error": "An account with this email already exists."}

        pw_hash = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt()).decode()
        cursor.execute(
            "INSERT INTO dbo.Users (full_name, company, email, password_hash) VALUES (%s, %s, %s, %s)",
            (req.full_name.strip(), req.company.strip(), req.email.lower(), pw_hash),
        )
        conn.commit()
        conn.close()
        return {"success": True}
    except Exception as e:
        return {"error": str(e)}


# ─── Login ─────────────────────────────────────────────────────────────────────

@app.post("/api/auth/login")
async def login(req: LoginRequest):
    if not req.email or not req.password:
        return {"error": "Please fill in all fields."}
    try:
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, full_name, company, password_hash FROM dbo.Users WHERE email = %s",
            (req.email.lower(),),
        )
        row = cursor.fetchone()
        conn.close()

        if not row:
            return {"error": "Invalid email or password."}

        user_id, full_name, company, pw_hash = row
        if not bcrypt.checkpw(req.password.encode(), pw_hash.encode()):
            return {"error": "Invalid email or password."}

        return {
            "success": True,
            "user": {"id": user_id, "full_name": full_name, "company": company, "email": req.email.lower()},
        }
    except Exception as e:
        return {"error": str(e)}

# ─── Email helper ─────────────────────────────────────────────────────────────

def send_email(to: str, subject: str, html: str):
    if not RESEND_API_KEY:
        print("⚠ Email skipped: RESEND_API_KEY not set")
        return
    try:
        with httpx.Client(timeout=15) as client:
            resp = client.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json"},
                json={"from": FROM_EMAIL, "to": [to], "subject": subject, "html": html},
            )
            resp.raise_for_status()
        print(f"✓ Email sent → {to}")
    except Exception as e:
        print(f"⚠ Email error: {e}")


# ─── Book Demo model & endpoint ───────────────────────────────────────────────

class DemoRequest(BaseModel):
    firstName:   str
    lastName:    str
    email:       str
    company:     str
    role:        str = ""
    companySize: str = ""
    annualSpend: str = ""
    message:     str = ""


@app.post("/api/book-demo")
async def book_demo(req: DemoRequest):
    if not req.firstName or not req.lastName or not req.email or not req.company:
        return {"error": "Please fill in all required fields."}

    # 1 — Save to Azure SQL
    try:
        conn   = get_db()
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO dbo.DemoRequests
               (first_name, last_name, email, company, role, company_size, annual_spend, message)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
            (req.firstName.strip(), req.lastName.strip(), req.email.lower(),
             req.company.strip(), req.role, req.companySize, req.annualSpend,
             req.message.strip()),
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"⚠ DB insert error: {e}")
        return {"error": "Could not save your request. Please try again."}

    # 2 — Notify team
    notify_html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;padding:24px;">
      <h2 style="color:#1B2A4A;border-bottom:2px solid #A56D58;padding-bottom:8px;">
        🐬 New Demo Request
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        <tr><td style="padding:8px;color:#666;width:140px;">Name</td>
            <td style="padding:8px;font-weight:600;">{req.firstName} {req.lastName}</td></tr>
        <tr style="background:#FDF6F2"><td style="padding:8px;color:#666;">Email</td>
            <td style="padding:8px;"><a href="mailto:{req.email}">{req.email}</a></td></tr>
        <tr><td style="padding:8px;color:#666;">Company</td>
            <td style="padding:8px;font-weight:600;">{req.company}</td></tr>
        <tr style="background:#FDF6F2"><td style="padding:8px;color:#666;">Role</td>
            <td style="padding:8px;">{req.role or '—'}</td></tr>
        <tr><td style="padding:8px;color:#666;">Company size</td>
            <td style="padding:8px;">{req.companySize or '—'}</td></tr>
        <tr style="background:#FDF6F2"><td style="padding:8px;color:#666;">Annual spend</td>
            <td style="padding:8px;">{req.annualSpend or '—'}</td></tr>
        {"<tr><td style='padding:8px;color:#666;vertical-align:top;'>Message</td><td style='padding:8px;'>" + req.message + "</td></tr>" if req.message else ""}
      </table>
      <p style="margin-top:24px;color:#999;font-size:12px;">
        Submitted via dolphinaipro.com — reply directly to <a href="mailto:{req.email}">{req.email}</a>
      </p>
    </div>
    """
    await asyncio.get_event_loop().run_in_executor(
        None, send_email, NOTIFY_EMAIL,
        f"New demo request — {req.firstName} {req.lastName}, {req.company}",
        notify_html
    )

    # 3 — Confirm to prospect
    confirm_html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;padding:24px;">
      <img src="https://dolphinaipro.com/logowebsite.png" alt="Dolphin AI" style="height:60px;margin-bottom:24px;" />
      <h2 style="color:#1B2A4A;">Hi {req.firstName}, thanks for getting in touch</h2>
      <p style="color:#444;line-height:1.6;">
        Thanks for your interest in Dolphin AI. We've received your demo request
        and someone from our team will reach out to you shortly.
      </p>
      <p style="color:#444;line-height:1.6;">In the meantime, you're welcome to explore the live classifier:</p>
      <a href="https://dolphinaipro.com/classify"
         style="display:inline-block;background:linear-gradient(135deg,#A56D58,#8B4E3A);
                color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;
                font-weight:600;margin-top:4px;">
        Try the classifier →
      </a>
      <p style="margin-top:32px;color:#999;font-size:12px;">
        Dolphin AI · dolphinaipro.com<br>
        You're receiving this because you requested a demo.
      </p>
    </div>
    """
    await asyncio.get_event_loop().run_in_executor(
        None, send_email, req.email,
        "We've received your Dolphin AI demo request",
        confirm_html
    )

    return {"success": True}


# ─── Contact form ─────────────────────────────────────────────────────────────

class ContactRequest(BaseModel):
    name:    str
    company: str = ""
    email:   str
    spend:   str = ""
    message: str

@app.post("/api/contact")
async def contact(req: ContactRequest):
    if not req.name or not req.email or not req.message:
        return {"error": "Please fill in all required fields."}
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;padding:24px;">
      <h2 style="color:#1B2A4A;border-bottom:2px solid #A56D58;padding-bottom:8px;">
        📩 New Contact Message
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        <tr><td style="padding:8px;color:#666;width:120px;">Name</td>
            <td style="padding:8px;font-weight:600;">{req.name}</td></tr>
        <tr style="background:#FDF6F2"><td style="padding:8px;color:#666;">Email</td>
            <td style="padding:8px;"><a href="mailto:{req.email}">{req.email}</a></td></tr>
        <tr><td style="padding:8px;color:#666;">Company</td>
            <td style="padding:8px;">{req.company or '—'}</td></tr>
        <tr style="background:#FDF6F2"><td style="padding:8px;color:#666;">Annual spend</td>
            <td style="padding:8px;">{req.spend or '—'}</td></tr>
        <tr><td style="padding:8px;color:#666;vertical-align:top;">Message</td>
            <td style="padding:8px;">{req.message}</td></tr>
      </table>
      <p style="margin-top:24px;color:#999;font-size:12px;">
        Submitted via dolphinaipro.com/contact
      </p>
    </div>
    """
    await asyncio.get_event_loop().run_in_executor(
        None, send_email, NOTIFY_EMAIL,
        f"New contact message — {req.name}, {req.company}",
        html
    )
    return {"success": True}


# ─── Layer 1: Recommendations ─────────────────────────────────────────────────
RECOMMENDATIONS = {
    "Dynaquip Engineers":           ("Direct Materials > Aluminum > Castings > Aluminum Die Casting", "Jeff"),
    "Concentris Manufacturing Solutions": ("Direct Materials > Aluminum > Castings > Aluminum Die Casting", "Zoltan Aranyos"),
    "Zetwerk Manufacturing":        ("Direct Materials > Aluminum > Castings > Aluminum Die Casting", "Zoltan Aranyos"),
    "Qcast Aluminum":               ("Direct Materials > Aluminum > Castings > Aluminum Sand Castings", "Jeff"),
    "Genesis BOLT AND Supply":      ("Direct Materials > Assembly Hardware > Assembly Hardware Other > Assembly Hardware Other", "Jeff"),
    "G V Machine":                  ("Direct Materials > Manufactured Components > Machined Components > Steel Machined Parts", "Jeff"),
    "ASH TEC":                      ("Direct Materials > Manufactured Components > Machined Components > Steel Machined Parts", "Zoltan Aranyos"),
    "Clark Industries":             ("Direct Materials > Manufactured Components > Machined Components > Steel Machined Parts", "Zoltan Aranyos"),
    "Willis Rubber":                ("Direct Materials > Manufactured Components > Rubber Components > Rubber Moldings", "Jeff"),
    "ROSE Metal Products":          ("Direct Materials > Outside Services > Fabrication & Welding Services > Fabrication & Welding Services", "Zoltan Aranyos"),
    "Tarsco Bolted TANK":           ("Direct Materials > Outside Services > Outside Services Other > Outside Services Other", "Zoltan Aranyos"),
    "Southwest Greens OF OHIO":     ("Direct Materials > Outside Services > Surfacing Services > Surfacing Services", "Zoltan Aranyos"),
    "Simona America":               ("Direct Materials > Resin & Plastic Components > Extruded Plastic > HDPE Sheet", "Jeff"),
    "Multiknit International":      ("Direct Materials > Resin & Plastic Components > Fabric > HDPE Fabric", "Jeff"),
    "Nationwide TURF":              ("Direct Materials > Resin & Plastic Components > Surfacing Products > Surfacing Products", "Zoltan Aranyos"),
    "Evolve PLAY":                  ("Direct Materials > Site Products > 3rd Party Play Products > Cast Concrete", "Zoltan Aranyos"),
    "FAHR Industries":              ("Direct Materials > Site Products > 3rd Party Play Products > Musical Instruments", "Zoltan Aranyos"),
    "Ironclad FAB TECH Private":    ("Direct Materials > Steel > Structural Steel > Beam/Channel", "Jeff"),
    "Mcmaster CARR":                ("Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > MRO Other > MRO Other", "Zoltan Aranyos"),
    "Fastenal":                     ("Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > MRO Other > MRO Other", "Zoltan Aranyos"),
    "Ridgid Paper TUBE":            ("Indirect Materials & Services > Packaging > Packaging Other > Packaging Other", "Zoltan Aranyos"),
    "PLAY Design International":    ("Indirect Materials & Services > Professional Services > Professional Services Other > Professional Services Other", "Zoltan Aranyos"),
    "Playsafe Surfacing":           ("Installers > Other-Installers > Other-Installers > Other-Installers", "Zoltan Aranyos"),
    "Playcare":                     ("Installers > Other-Installers > Other-Installers > Other-Installers", "Zoltan Aranyos"),
    "PLAY SAFE":                    ("Installers > Other-Installers > Other-Installers > Other-Installers", "Zoltan Aranyos"),
    "PLAYSAFE BY DESIGN":           ("Installers > Other-Installers > Other-Installers > Other-Installers", "Zoltan Aranyos"),
    "IWD Transportation":           ("Logistics > Logistics Services > 3PL Services > 3PL Services", "Chris McCain"),
    "Crown LIFT Trucks":            ("Logistics > Logistics Services > Customs Brokerage > Customs Brokerage", "Chris McCain"),
    "Geodis":                       ("Logistics > Logistics Services > Customs Brokerage > Customs Brokerage", "Chris McCain"),
    "UPS":                          ("Logistics > Transportation > Road > Trucking", "Chris McCain"),
    "FedEx":                        ("Logistics > Transportation > Road > Trucking", "Chris McCain"),
    "C H Robinson":                 ("Logistics > Transportation > Road > Trucking", "Chris McCain"),
    "JB HUNT Transport":            ("Logistics > Transportation > Road > Trucking", "Chris McCain"),
    "Schneider National":           ("Logistics > Transportation > Road > Trucking", "Chris McCain"),
    "DHL Global Forwarding":        ("Logistics > Transportation > Freight Forwarder > Freight Forwarder", "Chris McCain"),
    "AIT Worldwide Logistics":      ("Logistics > Transportation > Freight Forwarder > Freight Forwarder", "Chris McCain"),
    "Southwest Airlines Cargo":     ("Logistics > Transportation > Air > Out", "Chris McCain"),
    "NAPA AUTO Parts":              ("Logistics > PlayPower Fleet > Consumables > Maintenance", "Chris McCain"),
    "O Reilly AUTO Parts":          ("Logistics > PlayPower Fleet > Consumables > Maintenance", "Chris McCain"),
}

RECOMMENDATIONS_LOWER = {
    k.lower().strip(): v for k, v in RECOMMENDATIONS.items()
}

def get_recommendation(supplier: str):
    return RECOMMENDATIONS_LOWER.get(supplier.lower().strip())

# ─── Taxonomy ──────────────────────────────────────────────────────────────────
TAXONOMY = """Dealers/Reps > Commisions > Commisions > Commisions
Dealers/Reps > Other-Dealers/Reps > Other-Dealers/Reps > Other-Dealers/Reps
Dealers/Reps > Product by Other > Product by Other > Product by Other
Direct Materials > Aluminum > Aluminum Components > Aluminum CTL Sheet
Direct Materials > Aluminum > Aluminum Components > Aluminum Extrusions
Direct Materials > Aluminum > Aluminum Components > Aluminum Fabricated Parts
Direct Materials > Aluminum > Castings > Aluminum Die Casting
Direct Materials > Aluminum > Castings > Aluminum Sand Castings
Direct Materials > Assembly Hardware > Assembly Hardware Other > Assembly Hardware Other
Direct Materials > Assembly Hardware > Bearings & Bushings > Plastic Bearings & Bushings
Direct Materials > Assembly Hardware > Bearings & Bushings > Steel Bearings & Bushings
Direct Materials > Assembly Hardware > Bolts, Nuts & Washers > Anchors
Direct Materials > Assembly Hardware > Bolts, Nuts & Washers > Bolts
Direct Materials > Assembly Hardware > Bolts, Nuts & Washers > Eye Bolts
Direct Materials > Assembly Hardware > Bolts, Nuts & Washers > Fasteners
Direct Materials > Assembly Hardware > Bolts, Nuts & Washers > Galv Bolts
Direct Materials > Assembly Hardware > Bolts, Nuts & Washers > Galv Nuts
Direct Materials > Assembly Hardware > Bolts, Nuts & Washers > Galv Washers
Direct Materials > Assembly Hardware > Bolts, Nuts & Washers > Nuts
Direct Materials > Assembly Hardware > Bolts, Nuts & Washers > Rod
Direct Materials > Assembly Hardware > Bolts, Nuts & Washers > Self Drilling Screw
Direct Materials > Assembly Hardware > Bolts, Nuts & Washers > Spacers
Direct Materials > Assembly Hardware > Bolts, Nuts & Washers > SS Bolts
Direct Materials > Assembly Hardware > Bolts, Nuts & Washers > SS Nuts
Direct Materials > Assembly Hardware > Bolts, Nuts & Washers > SS Washers
Direct Materials > Assembly Hardware > Bolts, Nuts & Washers > Threaded Inserts
Direct Materials > Assembly Hardware > Bolts, Nuts & Washers > Washers
Direct Materials > Assembly Hardware > Bolts, Nuts & Washers > Wedge Anchors
Direct Materials > Assembly Hardware > Cabling and Accessories > Clamps
Direct Materials > Assembly Hardware > Cabling and Accessories > Connectors
Direct Materials > Assembly Hardware > Cabling and Accessories > Delta Quicklink
Direct Materials > Assembly Hardware > Cabling and Accessories > Jaw Ends
Direct Materials > Assembly Hardware > Cabling and Accessories > Pullies
Direct Materials > Assembly Hardware > Cabling and Accessories > Shackles
Direct Materials > Assembly Hardware > Cabling and Accessories > Steel Cable
Direct Materials > Assembly Hardware > Cabling and Accessories > Turnbuckles
Direct Materials > Assembly Hardware > Fasteners > Brackets
Direct Materials > Assembly Hardware > Fasteners > Ferrule
Direct Materials > Assembly Hardware > Fasteners > Latches
Direct Materials > Assembly Hardware > Fasteners > Stud
Direct Materials > Assembly Hardware > Fittings > Plastic Fittings
Direct Materials > Assembly Hardware > Fittings > Steel Fittings
Direct Materials > Assembly Hardware > Gasket > Neoprene
Direct Materials > Assembly Hardware > Playground Clevis > Playground Clevis
Direct Materials > Assembly Hardware > Shafts/Axles > Axles
Direct Materials > Assembly Hardware > Shafts/Axles > Shafts
Direct Materials > Manufactured Components > Graphics > Graphics
Direct Materials > Manufactured Components > Machined Components > Aluminum Machined Parts
Direct Materials > Manufactured Components > Machined Components > Plastic Machined Parts
Direct Materials > Manufactured Components > Machined Components > Steel Machined Parts
Direct Materials > Manufactured Components > Manufactured Components Other > Manufactured Components Other
Direct Materials > Manufactured Components > Metal Stampings > Metal Sheet Stampings
Direct Materials > Manufactured Components > Rigging > Chains
Direct Materials > Manufactured Components > Rigging > Fabric Netting
Direct Materials > Manufactured Components > Rigging > Ropes
Direct Materials > Manufactured Components > Rigging > Straps
Direct Materials > Manufactured Components > Rubber Components > Rubber Extrusions
Direct Materials > Manufactured Components > Rubber Components > Rubber Moldings
Direct Materials > Outside Services > Bending > Bending
Direct Materials > Outside Services > Coating > Galvanizing / Zinc Plating
Direct Materials > Outside Services > Coating > Paint
Direct Materials > Outside Services > Fabrication & Welding Services > Fabrication & Welding Services
Direct Materials > Outside Services > Machining > Machining
Direct Materials > Outside Services > Outside Services Other > Outside Services Other
Direct Materials > Outside Services > Printing / Silk Screening > Printing / Silk Screening
Direct Materials > Outside Services > Surfacing Services > Surfacing Services
Direct Materials > Paints & Coatings > Coating Materials > Coatings Other
Direct Materials > Paints & Coatings > Coating Materials > Elastomeric Polyurethane
Direct Materials > Paints & Coatings > Coating Materials > Plastisols/Polyeurea
Direct Materials > Paints & Coatings > Paints Other > Paints Other
Direct Materials > Paints & Coatings > Powder Paint > Colored Powder Paint
Direct Materials > Paints & Coatings > Powder Paint > Primers
Direct Materials > Paints & Coatings > Touch Up > Touch Up
Direct Materials > Resin & Plastic Components > Colorants > Colorants
Direct Materials > Resin & Plastic Components > Compounds > Compounds
Direct Materials > Resin & Plastic Components > Extruded Plastic > Achrylic Sheet
Direct Materials > Resin & Plastic Components > Extruded Plastic > HDPE Sheet
Direct Materials > Resin & Plastic Components > Extruded Plastic > Manufactured HDPE Component
Direct Materials > Resin & Plastic Components > Extruded Plastic > Other Plastic Sheet
Direct Materials > Resin & Plastic Components > Extruded Plastic > Plastic Extruded Parts
Direct Materials > Resin & Plastic Components > Extruded Plastic > Polycarbonate Sheet
Direct Materials > Resin & Plastic Components > Fabric > HDPE Fabric
Direct Materials > Resin & Plastic Components > Molded Plastic > Blow Molded
Direct Materials > Resin & Plastic Components > Molded Plastic > Injection Molded
Direct Materials > Resin & Plastic Components > Plastic Wood Components > Plastic Wood Components
Direct Materials > Resin & Plastic Components > Plastic Wood Components > Plastic Wood Sheet
Direct Materials > Resin & Plastic Components > Resin & Plastic Components Other > Resin & Plastic Components Other
Direct Materials > Resin & Plastic Components > Resin > MDPE
Direct Materials > Resin & Plastic Components > Sculpted Product > Expanded Polystyrene Blocks
Direct Materials > Resin & Plastic Components > Surfacing Products > EPDM
Direct Materials > Resin & Plastic Components > Surfacing Products > Polyurethane Binder
Direct Materials > Resin & Plastic Components > Surfacing Products > Recycled Shredded Rubber
Direct Materials > Resin & Plastic Components > Surfacing Products > Surfacing Products
Direct Materials > Site Products > 3rd Party Play Products > Cast Concrete
Direct Materials > Site Products > 3rd Party Play Products > Electronics
Direct Materials > Site Products > 3rd Party Play Products > Fiber Glass
Direct Materials > Site Products > 3rd Party Play Products > GFRC Concrete
Direct Materials > Site Products > 3rd Party Play Products > Musical Instruments
Direct Materials > Site Products > 3rd Party Play Products > Timber Products
Direct Materials > Site Products > Site Amenities > Benches
Direct Materials > Site Products > Site Amenities > Bike Racks
Direct Materials > Site Products > Site Amenities > Chairs
Direct Materials > Site Products > Site Amenities > Chairs & Seats
Direct Materials > Site Products > Site Amenities > Shade Structure
Direct Materials > Site Products > Site Amenities > Signs
Direct Materials > Site Products > Site Amenities > Tables
Direct Materials > Site Products > Site Amenities > Umbrellas
Direct Materials > Site Products > Site Amenities Hardware, Repairs, & Pieces > Site Amenities Hardware, Repairs, & Pieces
Direct Materials > Site Products > Site Products Other > Site Products Other
Direct Materials > Site Products > Solar Products > Solar Products
Direct Materials > Site Products > Surfacing > Concrete
Direct Materials > Steel > Sheet > Custom Plates
Direct Materials > Steel > Sheet > Galvanized Sheet
Direct Materials > Steel > Sheet > Hot Rolled Sheet
Direct Materials > Steel > Steel Netting > Steel Netting
Direct Materials > Steel > Steel Other > Steel Other
Direct Materials > Steel > Structural Steel > Angle
Direct Materials > Steel > Structural Steel > Beam/Channel
Direct Materials > Steel > Structural Steel > Flat Bar
Direct Materials > Steel > Structural Steel > Pipe
Direct Materials > Steel > Structural Steel > Plate
Direct Materials > Steel > Structural Steel > Round Bar
Direct Materials > Steel > Structural Steel > Tube
Direct Materials > Steel > Tubing > Black
Direct Materials > Steel > Tubing > Fabricated Black
Direct Materials > Steel > Tubing > Fabricated Galv
Direct Materials > Steel > Tubing > Galv
Indirect Materials & Services > Admin Services & Supplies > Charitable Donations > Charitable Donations
Indirect Materials & Services > Admin Services & Supplies > Dues & Subscriptions > Dues & Subscriptions
Indirect Materials & Services > Admin Services & Supplies > Fees & Charges > Association / Membership / Subscription Fees
Indirect Materials & Services > Admin Services & Supplies > Licenses & Permits > Licenses & Permits
Indirect Materials & Services > Admin Services & Supplies > Office Supplies & Equipment > Food and Beverage
Indirect Materials & Services > Admin Services & Supplies > Office Supplies & Equipment > Mailroom Supplies
Indirect Materials & Services > Admin Services & Supplies > Office Supplies & Equipment > Paper
Indirect Materials & Services > Admin Services & Supplies > Office Supplies & Equipment > Stationery
Indirect Materials & Services > Admin Services & Supplies > Office Supplies & Equipment > Toner & Ink Cart
Indirect Materials & Services > Admin Services & Supplies > Office Supplies & Equipment > Writing Instrument
Indirect Materials & Services > Construction > Construction Services & Sub-Contractors > Construction Services & Sub-Contractors
Indirect Materials & Services > Construction > Construction Services & Sub-Contractors > Demolition
Indirect Materials & Services > Construction > Construction Services & Sub-Contractors > Paving Services
Indirect Materials & Services > Entertainment > Entertainment > Entertainment
Indirect Materials & Services > Facilities > Building Maintenance > Alarm (Fire/Burglar/Security) Maintenance
Indirect Materials & Services > Facilities > Building Maintenance > Electrical
Indirect Materials & Services > Facilities > Building Maintenance > Facility Management
Indirect Materials & Services > Facilities > Building Maintenance > HVAC Servicing
Indirect Materials & Services > Facilities > Building Maintenance > Janitorial / Cleaning Services
Indirect Materials & Services > Facilities > Building Maintenance > Landscaping / Snow Removal
Indirect Materials & Services > Facilities > Building Maintenance > Painting
Indirect Materials & Services > Facilities > Building Maintenance > Plumbing
Indirect Materials & Services > Facilities > Building Maintenance > Roofing
Indirect Materials & Services > Facilities > Building Maintenance > Structural Maintenance
Indirect Materials & Services > Facilities > Facilities Other > Facilities Other
Indirect Materials & Services > Facilities > FF&E > Furniture
Indirect Materials & Services > Facilities > FF&E > Other
Indirect Materials & Services > Facilities > Inspection & Testing > Inspection & Testing
Indirect Materials & Services > Facilities > Plant Equipment > Manufacturing Equipment
Indirect Materials & Services > Facilities > Plant Equipment > Material Handling Equipment
Indirect Materials & Services > Facilities > Real Estate > Property Management
Indirect Materials & Services > Facilities > Rent / Lease > Rent / Lease
Indirect Materials & Services > Facilities > SECURITY SERVICES > SECURITY SERVICES
Indirect Materials & Services > Facilities > Utilities > Electricity
Indirect Materials & Services > Facilities > Utilities > Gas
Indirect Materials & Services > Facilities > Utilities > Water
Indirect Materials & Services > Facilities > Waste Management > Non-Hazardous
Indirect Materials & Services > Facilities > Waste Management > Recycling
Indirect Materials & Services > Facilities > Waste Management > Sewage Treatment
Indirect Materials & Services > Facilities > Waste Management > Water Treatment
Indirect Materials & Services > HR Services > Benefits > Wellness Program
Indirect Materials & Services > HR Services > HR Other > HR Other
Indirect Materials & Services > HR Services > Human Capital Management > Human Capital Management
Indirect Materials & Services > HR Services > Insurance > General Liability
Indirect Materials & Services > HR Services > Insurance > Life and Health and Accident Insurance
Indirect Materials & Services > HR Services > Insurance > Property insurance
Indirect Materials & Services > HR Services > Insurance > Umbrella Cover for Employees
Indirect Materials & Services > HR Services > Insurance > Workers Comp
Indirect Materials & Services > HR Services > Talent Management > Background Screening
Indirect Materials & Services > HR Services > Talent Management > Personnel Relocation
Indirect Materials & Services > HR Services > Talent Management > Recruiting
Indirect Materials & Services > HR Services > Talent Management > Temp Labor
Indirect Materials & Services > HR Services > Talent Management > Training
Indirect Materials & Services > Insurance > Dental Insurance > Dental Insurance
Indirect Materials & Services > Insurance > Insurance (Others) > Insurance (Others)
Indirect Materials & Services > Insurance > Vision Insurance > Vision Insurance
Indirect Materials & Services > IT/Telecom > IT Hardware & Accessories > Computer Accessories
Indirect Materials & Services > IT/Telecom > IT Hardware & Accessories > Desktop
Indirect Materials & Services > IT/Telecom > IT Hardware & Accessories > Docking Stations
Indirect Materials & Services > IT/Telecom > IT Hardware & Accessories > Hard drives
Indirect Materials & Services > IT/Telecom > IT Hardware & Accessories > Printers
Indirect Materials & Services > IT/Telecom > IT Lease > IT Lease - Printer
Indirect Materials & Services > IT/Telecom > IT Professional Service > Data Service
Indirect Materials & Services > IT/Telecom > IT Professional Service > IT Consulting
Indirect Materials & Services > IT/Telecom > IT Professional Service > Technical Support Services
Indirect Materials & Services > IT/Telecom > IT Professional Service > Web Hosting
Indirect Materials & Services > IT/Telecom > IT/Telecom Other > IT/Telecom Other
Indirect Materials & Services > IT/Telecom > Network > Cloud Services
Indirect Materials & Services > IT/Telecom > Network > Network security equipment
Indirect Materials & Services > IT/Telecom > Software > Accounting/Financial Software
Indirect Materials & Services > IT/Telecom > Software > ERP/MRP Software
Indirect Materials & Services > IT/Telecom > Software > HR Function Software
Indirect Materials & Services > IT/Telecom > Software > Inventory Management Software
Indirect Materials & Services > IT/Telecom > Software > Software Maintenance
Indirect Materials & Services > IT/Telecom > Software > Software Other
Indirect Materials & Services > IT/Telecom > Software > Subcription/License
Indirect Materials & Services > IT/Telecom > Software > Tax Preparation Software
Indirect Materials & Services > IT/Telecom > Telecom Hardware > Mobile Phones
Indirect Materials & Services > IT/Telecom > Telecom Service > Fixed Wirelined/Wireless Service
Indirect Materials & Services > IT/Telecom > Telecom Support > Telecom Equipment Maintenance & Support
Indirect Materials & Services > Marketing > Advertising > Advertising
Indirect Materials & Services > Marketing > Branding > Branding
Indirect Materials & Services > Marketing > Digital Marketing > Digital Marketing
Indirect Materials & Services > Marketing > Direct Marketing > Direct Marketing
Indirect Materials & Services > Marketing > Direct Marketing > Promotional Items
Indirect Materials & Services > Marketing > Trade Shows and Exhibits > Trade Shows and Exhibits
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Chemicals > Cleaner
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Chemicals > Industrial Gases
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Chemicals > Oils
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Chemicals > Sealants
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Chemicals > Steel Shot
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Electrical > Batteries and Component
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Electrical > Cables & Wires
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Electrical > Cables & Wiring Accessories
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Electrical > Electrical Hardware
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > HVAC > HVAC Supplies
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Industrial Maintenance > Industrial Maintenance Services
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Material Handling > Chain & Pulleys & Sprockets
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Material Handling > Conveyors & Parts
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Material Handling > Lifting equipment and accessories
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Mechanical > Bearings & Bushings
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Mechanical > Belts
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Mechanical > Compressor & Parts
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Mechanical > Couplings
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Mechanical > Cylinder
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Mechanical > Laser
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > MRO Other > MRO Other
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > OEM Parts > OEM Parts
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Paint Equipment and Supplies > Paint Equipment and Supplies
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Paint Equipment and Supplies > Paint nozzles
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Plumbing > Air Lubricators & Regulators & Parts
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Plumbing > Filters & Accessories
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Plumbing > Hoses & Hose Fittings
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Plumbing > Pipes & Pipe Fittings
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Plumbing > Pumps & Parts
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Plumbing > Tubes & Tube Fittings
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Plumbing > Valves & Parts
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Safety > P.P.E.
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Tools > Hand Tools
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Tools > Other Tools
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Tools > Power Tools
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Uniform, Mat & Janitorial Supplies > Janitorial Supplies
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Uniform, Mat & Janitorial Supplies > Uniform Service
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Uniform, Mat & Janitorial Supplies > Uniform, Mat & Janitorial Supplies
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Welding > Welding and Soldering machines
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Welding > Welding Rod
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Welding > Welding Supplies
Indirect Materials & Services > MRO(Maintenance, Repair, and Operations) > Welding > Welding Wire
Indirect Materials & Services > Packaging > Cardboard > Boxes
Indirect Materials & Services > Packaging > Cardboard > Corrugated Tube
Indirect Materials & Services > Packaging > Cardboard > Fanfold/End Caps
Indirect Materials & Services > Packaging > Cardboard > Sheet
Indirect Materials & Services > Packaging > Crates > Other Crates
Indirect Materials & Services > Packaging > Crates > Wood Crates
Indirect Materials & Services > Packaging > Foam > Fabricated
Indirect Materials & Services > Packaging > Foam > Sheet or Roll
Indirect Materials & Services > Packaging > Labels > Labels
Indirect Materials & Services > Packaging > Labels > Tags
Indirect Materials & Services > Packaging > Lumber > Dimensional Lumber
Indirect Materials & Services > Packaging > Lumber > Plywood
Indirect Materials & Services > Packaging > Misc Packaging > Bags
Indirect Materials & Services > Packaging > Misc Packaging > Containers
Indirect Materials & Services > Packaging > Misc Packaging > Drum & Crates
Indirect Materials & Services > Packaging > Misc Packaging > Lids & Closures
Indirect Materials & Services > Packaging > Misc Packaging > Packaging paper
Indirect Materials & Services > Packaging > Packaging Other > Packaging Other
Indirect Materials & Services > Packaging > Pallets > Custom
Indirect Materials & Services > Packaging > Pallets > Standard
Indirect Materials & Services > Packaging > Strapping > Metal Strapping
Indirect Materials & Services > Packaging > Strapping > Plastic Strapping
Indirect Materials & Services > Packaging > Strapping > Tape
Indirect Materials & Services > Packaging > Strapping > Vinyl Strapping
Indirect Materials & Services > Packaging > Wrapping > Bubble Wrap
Indirect Materials & Services > Packaging > Wrapping > Other Wrap
Indirect Materials & Services > Packaging > Wrapping > Stretch Wrap
Indirect Materials & Services > Professional Services > Consulting Service > Business Consulting
Indirect Materials & Services > Professional Services > Consulting Service > Financial Consulting
Indirect Materials & Services > Professional Services > Consulting Service > HR Consulting
Indirect Materials & Services > Professional Services > Consulting Service > Legal Consulting
Indirect Materials & Services > Professional Services > Consulting Service > Management Consulting
Indirect Materials & Services > Professional Services > Consulting Service > Marketing and Sales Consulting
Indirect Materials & Services > Professional Services > Consulting Service > Other Consulting
Indirect Materials & Services > Professional Services > Consulting Service > Supply Chain Consulting
Indirect Materials & Services > Professional Services > Engineering > Engineering
Indirect Materials & Services > Professional Services > Financial Services > Accounting Services (Audit, Taxation, etc)
Indirect Materials & Services > Professional Services > Financial services > Banking
Indirect Materials & Services > Professional Services > Financial services > Corporate Finance Services
Indirect Materials & Services > Professional Services > Financial services > Credit Card
Indirect Materials & Services > Professional Services > Financial services > Payment Processing Services
Indirect Materials & Services > Professional Services > Legal Services > Legal Services
Indirect Materials & Services > Professional Services > Procurement > Purchasing Cooperative
Indirect Materials & Services > Professional Services > Professional Services Other > Professional Services Other
Indirect Materials & Services > Professional Services > Real Estate Services > Real Estate Services
Indirect Materials & Services > Rental Equipment External > Material Handling Equipment > Material Handling Equipment - Rental
Indirect Materials & Services > Rental Equipment External > Rental Equipment Other > Rental Equipment Other
Indirect Materials & Services > Rental Equipment External > Tools > Tools
Indirect Materials & Services > Taxes > Local > Local
Indirect Materials & Services > Taxes > State > State
Indirect Materials & Services > Taxes > Taxes Other > Taxes Other
Indirect Materials & Services > Travel > Accommodation > Airbnb or Similar Services
Indirect Materials & Services > Travel > Accommodation > Hotel
Indirect Materials & Services > Travel > Air Travel > Excess Baggage Fees
Indirect Materials & Services > Travel > Air Travel > Flights
Indirect Materials & Services > Travel > Ground Transportation > Bus
Indirect Materials & Services > Travel > Ground Transportation > Car Rental
Indirect Materials & Services > Travel > Ground Transportation > Fuel
Indirect Materials & Services > Travel > Ground Transportation > Parking Fees
Indirect Materials & Services > Travel > Ground Transportation > Private Car (Mileage Reimbursement)
Indirect Materials & Services > Travel > Ground Transportation > Taxi/Rideshare (e.g., Uber, Lyft)
Indirect Materials & Services > Travel > Ground Transportation > Tolls
Indirect Materials & Services > Travel > Ground Transportation > Train
Indirect Materials & Services > Travel > Meals > Per Diem
Indirect Materials & Services > Travel > Meals > Team Meeting Meal
Indirect Materials & Services > Travel > Travel Administration > Offical fees
Indirect Materials & Services > Travel > Travel Insurance > Trip Cancellation
Installers > Indoor > Indoor > Indoor
Installers > Other-Installers > Other-Installers > Other-Installers
Installers > Outdoor > Outdoor > Outdoor
Logistics > Logistics Services > 3PL Services > 3PL Services
Logistics > Logistics Services > 3PL Warehouse > 3PL Warehouse
Logistics > Logistics Services > Customs Brokerage > Customs Brokerage
Logistics > Logistics Services > Equipment > Trailer Lease
Logistics > Logistics Services > Equipment > Truck Lease
Logistics > PlayPower Fleet > Consumables > Maintenance
Logistics > PlayPower Fleet > Consumables > Tires
Logistics > Transportation > Air > In
Logistics > Transportation > Air > Out
Logistics > Transportation > Cross Docking/Transloading > Cros Docking/Transloading
Logistics > Transportation > Freight Forwarder > Freight Forwarder
Logistics > Transportation > Rail > In
Logistics > Transportation > Road > Trucking
Unclassified > Unclassified > Unclassified > Unclassified"""

TAXONOMY_LIST = [t.strip() for t in TAXONOMY.strip().split("\n") if t.strip()]
TAXONOMY_STR  = "\n".join(TAXONOMY_LIST)

# ─── System prompt ─────────────────────────────────────────────────────────────
SYSTEM_PROMPT = f"""You are an expert procurement analyst at PlayPower Inc., the world's largest manufacturer of playground equipment and recreational products.

WHAT PLAYPOWER BUYS:
- Raw steel: tubing (black/galv), structural steel (plate/pipe/angle/beam/flat bar/round bar), sheet steel, steel netting
- Aluminum: die castings, sand castings, extrusions, fabricated parts
- Plastics: HDPE sheet, polycarbonate sheet, injection molded parts, blow molded parts, plastic wood
- Rubber: molded rubber components, rubber extrusions, EPDM surfacing granules, polyurethane binder
- Coatings: colored powder paint, primers, plastisols, touch-up paint, polyurethane coatings
- Assembly hardware: bolts, nuts, washers, screws, cables, shackles, ferrules, bearings, shafts, clevis hardware
- Manufactured parts: machined steel parts, graphics/decals, metal stampings, rigging (chains, ropes, netting)
- Outside services: galvanizing, machining, fabrication/welding, surfacing installation, bending, printing
- Site products: fiberglass beams, cast concrete, electronics panels, musical instruments, timber, site amenities
- Packaging: cardboard boxes, wood crates, foam, pallets, strapping, stretch wrap, bags
- MRO: tools, welding supplies, safety/PPE, chemicals, electrical components, maintenance supplies
- Indirect: IT software, HR, facilities, professional services, travel, insurance, taxes

TAXONOMY — pick EXACTLY ONE:
{TAXONOMY_STR}

CLASSIFICATION RULES — follow ALL of these strictly:
1. LEVEL 1 = supplier's PRIMARY business activity — most critical decision
2. LEVELS 2-4 = what the specific item IS — be as specific as possible
3. Steel tubing: Black steel tube/pipe → Steel > Tubing > Black; Galvanized → Steel > Tubing > Galv
4. Structural steel: Plate → Steel > Structural Steel > Plate; Angle → Structural Steel > Angle
5. Fasteners (Direct Materials — go into the product): Galv bolts → Assembly Hardware > Bolts, Nuts & Washers > Galv Bolts
6. Galvanizing SERVICE → Outside Services > Coating > Galvanizing / Zinc Plating
7. EPDM granules → Resin & Plastic Components > Surfacing Products > EPDM
8. Powder paint → Paints & Coatings > Powder Paint > Colored Powder Paint
9. MRO tools/safety/maintenance → Indirect > MRO (NOT Direct Materials)
10. If no description → classify by supplier name alone — NEVER return Unclassified

RESPONSE — return ONLY valid JSON, no markdown:
{{
  "classification": "exact category path from taxonomy above",
  "explanation": "Write 2-3 sentences: (1) what this supplier's primary business is and why that determines Level 1, (2) what the specific item is, (3) why this exact category was chosen."
}}"""


# ─── Request model ─────────────────────────────────────────────────────────────
class ClassifyRequest(BaseModel):
    supplier: str
    po_description: str = ""
    invoice_description: str = ""


def is_empty(v: str) -> bool:
    return not v or v.strip().lower() in ("", "nan", "none")


# ─── Endpoint ──────────────────────────────────────────────────────────────────
@app.post("/api/classify")
async def classify_endpoint(req: ClassifyRequest):
    supplier = req.supplier.strip()
    if not supplier:
        return {"error": "Supplier name is required"}

    # Layer 1: Recommendations
    rec = get_recommendation(supplier)
    if rec:
        cat, recommender = rec
        levels = cat.split(" > ")
        return {
            "classification": cat,
            "levels": levels,
            "explanation": (
                f"Classification recommended by {recommender} (sourcing team). "
                f"Supplier '{supplier}' is mapped to '{cat}' based on their approved "
                f"primary business activity in the recommendations list."
            ),
            "source": "recommendation",
            "recommender": recommender,
        }

    # Layer 3: GPT-4o-mini
    po  = req.po_description.strip()
    inv = req.invoice_description.strip()

    if not is_empty(po) or not is_empty(inv):
        desc = ""
        if not is_empty(po):  desc += f"PO Description: {po}\n"
        if not is_empty(inv): desc += f"Invoice Description: {inv}\n"
        user_msg = f"Supplier: {supplier}\n{desc}\nClassify this purchase and explain your reasoning."
    else:
        user_msg = (
            f"Supplier: {supplier}\n"
            f"No item description available. Classify based on this supplier's name "
            f"and known business activity. Do NOT return Unclassified — always find the best match."
        )

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user",   "content": user_msg},
            ],
            max_tokens=350,
            temperature=0,
            response_format={"type": "json_object"},
        )
        result = json.loads(response.choices[0].message.content)
        cat  = result.get("classification", "").strip()
        expl = result.get("explanation", "").strip()

        if cat not in TAXONOMY_LIST:
            matches = get_close_matches(cat, TAXONOMY_LIST, n=1, cutoff=0.5)
            cat = matches[0] if matches else "Unclassified > Unclassified > Unclassified > Unclassified"

        return {
            "classification": cat,
            "levels": cat.split(" > "),
            "explanation": expl,
            "source": "ai",
        }

    except Exception as e:
        return {
            "error": str(e),
            "classification": "Unclassified > Unclassified > Unclassified > Unclassified",
            "levels": ["Unclassified", "Unclassified", "Unclassified", "Unclassified"],
            "source": "error",
        }


@app.get("/api/health")
def health():
    return {"status": "ok", "model": "gpt-4o-mini", "rules": len(RECOMMENDATIONS)}
