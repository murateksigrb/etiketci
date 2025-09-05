from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template.loader import render_to_string
import datetime
import pdfkit
import os

# Create your views here.
PRODUCTS = [
    {"code": "ABC123", "brand": "Zwilling", "price": 1499},
    {"code": "XYZ456", "brand": "Beko", "price": 3299},
    {"code": "DEF789", "brand": "BergHOFF", "price": 2599},
    {"code": "GHI101", "brand": "Laurastar", "price": 1599},
    {"code": "JKL121", "brand": "Philips", "price": 599},
    {"code": "MNO131", "brand": "Ankarsrum", "price": 4599},
    {"code": "188DRG", "brand": "Fritel", "price": 1499},
    {"code": "222LGS", "brand": "Electrolux", "price": 3299},
    {"code": "234AYT", "brand": "Kuhn Rikon", "price": 2599},
    {"code": "345AYC", "brand": "samsung", "price": 1599},
    {"code": "456TYT", "brand": "Kuhn Rikon", "price": 599},
    {"code": "567AGZ", "brand": "Ankarsrum", "price": 4599},
]


def index(request):
    query = request.GET.get("q", "")
    results = []
    selected = request.session.get("selected", [])

    # PDF Export
    if request.GET.get("export_pdf"):
        return export_pdf(request, selected)

    # Arama
    if query:
        results = [p for p in PRODUCTS if query.lower() in p["code"].lower()]

    # "Ekle" butonu
    add_code = request.GET.get("add")
    if add_code:
        product = next((p for p in PRODUCTS if p["code"] == add_code), None)
        if product and product not in selected:
            selected.append(product)
            request.session["selected"] = selected
        return redirect("index")

    # "Kaldır" butonu
    remove_code = request.GET.get("remove")
    if remove_code:
        selected = [p for p in selected if p["code"] != remove_code]
        request.session["selected"] = selected
        return redirect("index")

    # bugünün tarihi
    today = datetime.date.today().strftime("%d.%m.%Y")

    return render(
        request,
        "shop/index.html",
        {"query": query, "results": results, "selected": selected, "today": today},
    )


def export_pdf(request, selected):
    """PDF export functionality"""
    if not selected:
        return redirect("index")

    today = datetime.date.today().strftime("%d.%m.%Y")

    # Render HTML template for PDF
    html_content = render_to_string(
        "shop/pdf_template.html",
        {
            "selected": selected,
            "today": today,
        },
    )

    # PDF options to prevent cutting labels
    options = {
        "page-size": "A4",
        "margin-top": "10mm",
        "margin-right": "10mm",
        "margin-bottom": "10mm",
        "margin-left": "10mm",
        "encoding": "UTF-8",
        "no-outline": None,
        "enable-local-file-access": None,
        "page-break-inside": "avoid",
    }

    try:
        # Generate PDF
        pdf = pdfkit.from_string(html_content, False, options=options)

        # Create response
        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = (
            f'attachment; filename="etiketler_{today}.pdf"'
        )

        return response

    except Exception as e:
        # Fallback to browser print if pdfkit fails
        return render(
            request,
            "shop/pdf_template.html",
            {
                "selected": selected,
                "today": today,
                "print_mode": True,
            },
        )
