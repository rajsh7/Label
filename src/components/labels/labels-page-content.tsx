"use client"

import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  X,
  Filter,
  Grid3X3,
  List,
  ChevronDown,
  Printer,
  ArrowRight,
  Sparkles,
  Clock,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"

// Label data - 255+ labels across all categories
const allLabels = [
  // Amazon FBA (25 labels)
  {
    id: 1,
    name: "Amazon FBA 4x6 Thermal",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO", "Rollo"],
    popular: true,
  },
  {
    id: 2,
    name: "Amazon FBA 2.5x4",
    dimensions: "63.5x101.6 mm (2.5x4 in)",
    pixels: "508x812px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 3,
    name: "Amazon FBA 3x5",
    dimensions: "76.2x127 mm (3x5 in)",
    pixels: "610x1016px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 4,
    name: "Amazon FBA 5x7",
    dimensions: "127x177.8 mm (5x7 in)",
    pixels: "1016x1422px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Inkjet",
    printers: ["HP", "Canon", "Epson"],
  },
  {
    id: 5,
    name: "Amazon FBA FNSKU 1x2",
    dimensions: "25.4x50.8 mm (1x2 in)",
    pixels: "203x406px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 6,
    name: "Amazon FBA Poly Bag",
    dimensions: "50.8x101.6 mm (2x4 in)",
    pixels: "406x812px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO"],
  },
  {
    id: 7,
    name: "Amazon FBA Box Label",
    dimensions: "101.6x101.6 mm (4x4 in)",
    pixels: "812x812px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 8,
    name: "Amazon FBA Pallet Label",
    dimensions: "152.4x101.6 mm (6x4 in)",
    pixels: "1218x812px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },
  {
    id: 9,
    name: "Amazon FBA 4x6.75",
    dimensions: "101.6x171.5 mm (4x6.75 in)",
    pixels: "812x1372px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
    popular: true,
  },
  {
    id: 10,
    name: "Amazon FBA Letter",
    dimensions: "215.9x279.4 mm (8.5x11 in)",
    pixels: "2550x3300px @ 300 DPI",
    category: "Amazon FBA",
    printMethod: "Inkjet",
    printers: ["HP", "Canon", "Brother"],
  },
  {
    id: 11,
    name: "Amazon FBA Half Letter",
    dimensions: "215.9x139.7 mm (8.5x5.5 in)",
    pixels: "2550x1650px @ 300 DPI",
    category: "Amazon FBA",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 12,
    name: "Amazon FBA 2x1 Barcode",
    dimensions: "50.8x25.4 mm (2x1 in)",
    pixels: "406x203px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 13,
    name: "Amazon FBA 3x2 Barcode",
    dimensions: "76.2x50.8 mm (3x2 in)",
    pixels: "610x406px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO"],
  },
  {
    id: 14,
    name: "Amazon FBA Hazmat",
    dimensions: "101.6x101.6 mm (4x4 in)",
    pixels: "812x812px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },
  {
    id: 15,
    name: "Amazon FBA Suffocation Warning",
    dimensions: "76.2x50.8 mm (3x2 in)",
    pixels: "610x406px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 16,
    name: "Amazon FBA 4x3",
    dimensions: "101.6x76.2 mm (4x3 in)",
    pixels: "812x610px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 17,
    name: "Amazon FBA 2x3",
    dimensions: "50.8x76.2 mm (2x3 in)",
    pixels: "406x610px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 18,
    name: "Amazon FBA 1.5x1",
    dimensions: "38.1x25.4 mm (1.5x1 in)",
    pixels: "305x203px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 19,
    name: "Amazon FBA Case Label",
    dimensions: "101.6x50.8 mm (4x2 in)",
    pixels: "812x406px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 20,
    name: "Amazon FBA Oversize",
    dimensions: "152.4x203.2 mm (6x8 in)",
    pixels: "1218x1625px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },
  {
    id: 21,
    name: "Amazon FBA 3x1",
    dimensions: "76.2x25.4 mm (3x1 in)",
    pixels: "610x203px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 22,
    name: "Amazon FBA 2.25x1.25",
    dimensions: "57.2x31.8 mm (2.25x1.25 in)",
    pixels: "457x254px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["DYMO", "Zebra"],
  },
  {
    id: 23,
    name: "Amazon FBA Prep Label",
    dimensions: "50.8x25.4 mm (2x1 in)",
    pixels: "406x203px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 24,
    name: "Amazon FBA 4x2.5",
    dimensions: "101.6x63.5 mm (4x2.5 in)",
    pixels: "812x508px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 25,
    name: "Amazon FBA 3.5x1.5",
    dimensions: "88.9x38.1 mm (3.5x1.5 in)",
    pixels: "711x305px @ 203 DPI",
    category: "Amazon FBA",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },

  // Walmart (20 labels)
  {
    id: 26,
    name: "Walmart FWA 4x6 Thermal",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Walmart",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO", "Rollo"],
    popular: true,
  },
  {
    id: 27,
    name: "Walmart FWA 2x3",
    dimensions: "50.8x76.2 mm (2x3 in)",
    pixels: "406x610px @ 203 DPI",
    category: "Walmart",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 28,
    name: "Walmart FWA 3x5",
    dimensions: "76.2x127 mm (3x5 in)",
    pixels: "610x1016px @ 203 DPI",
    category: "Walmart",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 29,
    name: "Walmart FWA 5x7",
    dimensions: "127x177.8 mm (5x7 in)",
    pixels: "1016x1422px @ 203 DPI",
    category: "Walmart",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 30,
    name: "Walmart WFS 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Walmart",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 31,
    name: "Walmart Case Label",
    dimensions: "101.6x101.6 mm (4x4 in)",
    pixels: "812x812px @ 203 DPI",
    category: "Walmart",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },
  {
    id: 32,
    name: "Walmart Pallet Label",
    dimensions: "152.4x101.6 mm (6x4 in)",
    pixels: "1218x812px @ 203 DPI",
    category: "Walmart",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },
  {
    id: 33,
    name: "Walmart 2x1 Barcode",
    dimensions: "50.8x25.4 mm (2x1 in)",
    pixels: "406x203px @ 203 DPI",
    category: "Walmart",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 34,
    name: "Walmart Letter",
    dimensions: "215.9x279.4 mm (8.5x11 in)",
    pixels: "2550x3300px @ 300 DPI",
    category: "Walmart",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 35,
    name: "Walmart Half Letter",
    dimensions: "215.9x139.7 mm (8.5x5.5 in)",
    pixels: "2550x1650px @ 300 DPI",
    category: "Walmart",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 36,
    name: "Walmart 4x3",
    dimensions: "101.6x76.2 mm (4x3 in)",
    pixels: "812x610px @ 203 DPI",
    category: "Walmart",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 37,
    name: "Walmart 3x2",
    dimensions: "76.2x50.8 mm (3x2 in)",
    pixels: "610x406px @ 203 DPI",
    category: "Walmart",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 38,
    name: "Walmart 2.25x1.25",
    dimensions: "57.2x31.8 mm (2.25x1.25 in)",
    pixels: "457x254px @ 203 DPI",
    category: "Walmart",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 39,
    name: "Walmart Hazmat",
    dimensions: "101.6x101.6 mm (4x4 in)",
    pixels: "812x812px @ 203 DPI",
    category: "Walmart",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },
  {
    id: 40,
    name: "Walmart 4x2",
    dimensions: "101.6x50.8 mm (4x2 in)",
    pixels: "812x406px @ 203 DPI",
    category: "Walmart",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 41,
    name: "Walmart 3x1",
    dimensions: "76.2x25.4 mm (3x1 in)",
    pixels: "610x203px @ 203 DPI",
    category: "Walmart",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 42,
    name: "Walmart 1.5x1",
    dimensions: "38.1x25.4 mm (1.5x1 in)",
    pixels: "305x203px @ 203 DPI",
    category: "Walmart",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 43,
    name: "Walmart Oversize",
    dimensions: "152.4x203.2 mm (6x8 in)",
    pixels: "1218x1625px @ 203 DPI",
    category: "Walmart",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },
  {
    id: 44,
    name: "Walmart 2x4",
    dimensions: "50.8x101.6 mm (2x4 in)",
    pixels: "406x812px @ 203 DPI",
    category: "Walmart",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 45,
    name: "Walmart DSV Label",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Walmart",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },

  // eBay (18 labels)
  {
    id: 46,
    name: "eBay 4x6 Thermal",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "eBay",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO", "Rollo"],
    popular: true,
  },
  {
    id: 47,
    name: "eBay 4x5.5",
    dimensions: "101.6x139.7 mm (4x5.5 in)",
    pixels: "812x1117px @ 203 DPI",
    category: "eBay",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 48,
    name: "eBay 4x7",
    dimensions: "101.6x177.8 mm (4x7 in)",
    pixels: "812x1422px @ 203 DPI",
    category: "eBay",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 49,
    name: "eBay 5x7",
    dimensions: "127x177.8 mm (5x7 in)",
    pixels: "1016x1422px @ 203 DPI",
    category: "eBay",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 50,
    name: "eBay Letter",
    dimensions: "215.9x279.4 mm (8.5x11 in)",
    pixels: "2550x3300px @ 300 DPI",
    category: "eBay",
    printMethod: "Inkjet",
    printers: ["HP", "Canon", "Brother"],
  },
  {
    id: 51,
    name: "eBay Half Letter",
    dimensions: "215.9x139.7 mm (8.5x5.5 in)",
    pixels: "2550x1650px @ 300 DPI",
    category: "eBay",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 52,
    name: "eBay 2x7 Packing Slip",
    dimensions: "50.8x177.8 mm (2x7 in)",
    pixels: "406x1422px @ 203 DPI",
    category: "eBay",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 53,
    name: "eBay 4x3",
    dimensions: "101.6x76.2 mm (4x3 in)",
    pixels: "812x610px @ 203 DPI",
    category: "eBay",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 54,
    name: "eBay 3x2",
    dimensions: "76.2x50.8 mm (3x2 in)",
    pixels: "610x406px @ 203 DPI",
    category: "eBay",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 55,
    name: "eBay 2x1 Barcode",
    dimensions: "50.8x25.4 mm (2x1 in)",
    pixels: "406x203px @ 203 DPI",
    category: "eBay",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 56,
    name: "eBay 4x6.75",
    dimensions: "101.6x171.5 mm (4x6.75 in)",
    pixels: "812x1372px @ 203 DPI",
    category: "eBay",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 57,
    name: "eBay GSP 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "eBay",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 58,
    name: "eBay 3x5",
    dimensions: "76.2x127 mm (3x5 in)",
    pixels: "610x1016px @ 203 DPI",
    category: "eBay",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO"],
  },
  {
    id: 59,
    name: "eBay 2x3",
    dimensions: "50.8x76.2 mm (2x3 in)",
    pixels: "406x610px @ 203 DPI",
    category: "eBay",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 60,
    name: "eBay 4x4",
    dimensions: "101.6x101.6 mm (4x4 in)",
    pixels: "812x812px @ 203 DPI",
    category: "eBay",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 61,
    name: "eBay 2.25x1.25",
    dimensions: "57.2x31.8 mm (2.25x1.25 in)",
    pixels: "457x254px @ 203 DPI",
    category: "eBay",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 62,
    name: "eBay International",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "eBay",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 63,
    name: "eBay 4x2",
    dimensions: "101.6x50.8 mm (4x2 in)",
    pixels: "812x406px @ 203 DPI",
    category: "eBay",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },

  // Shopify (30 labels)
  {
    id: 64,
    name: "Shopify 4x6 Thermal",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO", "Rollo"],
    popular: true,
  },
  {
    id: 65,
    name: "Shopify Letter",
    dimensions: "215.9x279.4 mm (8.5x11 in)",
    pixels: "2550x3300px @ 300 DPI",
    category: "Shopify",
    printMethod: "Inkjet",
    printers: ["HP", "Canon", "Brother"],
  },
  {
    id: 66,
    name: "Shopify Half Letter",
    dimensions: "215.9x139.7 mm (8.5x5.5 in)",
    pixels: "2550x1650px @ 300 DPI",
    category: "Shopify",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 67,
    name: "Shopify A4",
    dimensions: "210x297 mm (8.27x11.69 in)",
    pixels: "2480x3508px @ 300 DPI",
    category: "Shopify",
    printMethod: "Inkjet",
    printers: ["HP", "Canon", "Epson"],
  },
  {
    id: 68,
    name: "Shopify A6",
    dimensions: "105x148 mm (4.13x5.83 in)",
    pixels: "1240x1748px @ 300 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["Zebra", "Brother"],
  },
  {
    id: 69,
    name: "Shopify 4x3",
    dimensions: "101.6x76.2 mm (4x3 in)",
    pixels: "812x610px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 70,
    name: "Shopify 3x2",
    dimensions: "76.2x50.8 mm (3x2 in)",
    pixels: "610x406px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 71,
    name: "Shopify 2x1 Barcode",
    dimensions: "50.8x25.4 mm (2x1 in)",
    pixels: "406x203px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 72,
    name: "Shopify 4x6.75",
    dimensions: "101.6x171.5 mm (4x6.75 in)",
    pixels: "812x1372px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 73,
    name: "Shopify 5x7",
    dimensions: "127x177.8 mm (5x7 in)",
    pixels: "1016x1422px @ 203 DPI",
    category: "Shopify",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 74,
    name: "Shopify 3x5",
    dimensions: "76.2x127 mm (3x5 in)",
    pixels: "610x1016px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO"],
  },
  {
    id: 75,
    name: "Shopify 2x3",
    dimensions: "50.8x76.2 mm (2x3 in)",
    pixels: "406x610px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 76,
    name: "Shopify 4x4",
    dimensions: "101.6x101.6 mm (4x4 in)",
    pixels: "812x812px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 77,
    name: "Shopify 2.25x1.25",
    dimensions: "57.2x31.8 mm (2.25x1.25 in)",
    pixels: "457x254px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 78,
    name: "Shopify 4x2",
    dimensions: "101.6x50.8 mm (4x2 in)",
    pixels: "812x406px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 79,
    name: "Shopify 3x1",
    dimensions: "76.2x25.4 mm (3x1 in)",
    pixels: "610x203px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 80,
    name: "Shopify Product Label",
    dimensions: "50.8x25.4 mm (2x1 in)",
    pixels: "406x203px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 81,
    name: "Shopify Packing Slip",
    dimensions: "215.9x279.4 mm (8.5x11 in)",
    pixels: "2550x3300px @ 300 DPI",
    category: "Shopify",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 82,
    name: "Shopify Return Label",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 83,
    name: "Shopify 1.5x1",
    dimensions: "38.1x25.4 mm (1.5x1 in)",
    pixels: "305x203px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 84,
    name: "Shopify 2x2 Square",
    dimensions: "50.8x50.8 mm (2x2 in)",
    pixels: "406x406px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 85,
    name: "Shopify 3x3 Square",
    dimensions: "76.2x76.2 mm (3x3 in)",
    pixels: "610x610px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO"],
  },
  {
    id: 86,
    name: "Shopify Circle 2in",
    dimensions: "50.8mm diameter (2 in)",
    pixels: "406x406px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 87,
    name: "Shopify 6x4",
    dimensions: "152.4x101.6 mm (6x4 in)",
    pixels: "1218x812px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },
  {
    id: 88,
    name: "Shopify Legal",
    dimensions: "215.9x355.6 mm (8.5x14 in)",
    pixels: "2550x4200px @ 300 DPI",
    category: "Shopify",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 89,
    name: "Shopify Custom 5x8",
    dimensions: "127x203.2 mm (5x8 in)",
    pixels: "1016x1625px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },
  {
    id: 90,
    name: "Shopify A5",
    dimensions: "148x210 mm (5.83x8.27 in)",
    pixels: "1748x2480px @ 300 DPI",
    category: "Shopify",
    printMethod: "Inkjet",
    printers: ["HP", "Canon", "Epson"],
  },
  {
    id: 91,
    name: "Shopify 4x5",
    dimensions: "101.6x127 mm (4x5 in)",
    pixels: "812x1016px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 92,
    name: "Shopify 2.5x4",
    dimensions: "63.5x101.6 mm (2.5x4 in)",
    pixels: "508x812px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 93,
    name: "Shopify Fragile",
    dimensions: "76.2x50.8 mm (3x2 in)",
    pixels: "610x406px @ 203 DPI",
    category: "Shopify",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },

  // Etsy (22 labels)
  {
    id: 94,
    name: "Etsy 4x6 Thermal",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Etsy",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO", "Rollo"],
    popular: true,
  },
  {
    id: 95,
    name: "Etsy 2x3 Thank You",
    dimensions: "50.8x76.2 mm (2x3 in)",
    pixels: "406x610px @ 203 DPI",
    category: "Etsy",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 96,
    name: "Etsy 3x5 Gift Tag",
    dimensions: "76.2x127 mm (3x5 in)",
    pixels: "610x1016px @ 203 DPI",
    category: "Etsy",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO"],
  },
  {
    id: 97,
    name: "Etsy Letter",
    dimensions: "215.9x279.4 mm (8.5x11 in)",
    pixels: "2550x3300px @ 300 DPI",
    category: "Etsy",
    printMethod: "Inkjet",
    printers: ["HP", "Canon", "Brother"],
  },
  {
    id: 98,
    name: "Etsy Half Letter",
    dimensions: "215.9x139.7 mm (8.5x5.5 in)",
    pixels: "2550x1650px @ 300 DPI",
    category: "Etsy",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 99,
    name: "Etsy 2x2 Square",
    dimensions: "50.8x50.8 mm (2x2 in)",
    pixels: "406x406px @ 203 DPI",
    category: "Etsy",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 100,
    name: "Etsy Circle 1.5in",
    dimensions: "38.1mm diameter (1.5 in)",
    pixels: "305x305px @ 203 DPI",
    category: "Etsy",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 101,
    name: "Etsy Circle 2in",
    dimensions: "50.8mm diameter (2 in)",
    pixels: "406x406px @ 203 DPI",
    category: "Etsy",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 102,
    name: "Etsy 1x1 Product",
    dimensions: "25.4x25.4 mm (1x1 in)",
    pixels: "203x203px @ 203 DPI",
    category: "Etsy",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 103,
    name: "Etsy 4x3",
    dimensions: "101.6x76.2 mm (4x3 in)",
    pixels: "812x610px @ 203 DPI",
    category: "Etsy",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 104,
    name: "Etsy 3x2",
    dimensions: "76.2x50.8 mm (3x2 in)",
    pixels: "610x406px @ 203 DPI",
    category: "Etsy",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 105,
    name: "Etsy 5x7 Card",
    dimensions: "127x177.8 mm (5x7 in)",
    pixels: "1016x1422px @ 203 DPI",
    category: "Etsy",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 106,
    name: "Etsy 4x6.75",
    dimensions: "101.6x171.5 mm (4x6.75 in)",
    pixels: "812x1372px @ 203 DPI",
    category: "Etsy",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 107,
    name: "Etsy Handmade Tag",
    dimensions: "38.1x76.2 mm (1.5x3 in)",
    pixels: "305x610px @ 203 DPI",
    category: "Etsy",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 108,
    name: "Etsy Care Label",
    dimensions: "25.4x50.8 mm (1x2 in)",
    pixels: "203x406px @ 203 DPI",
    category: "Etsy",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 109,
    name: "Etsy 2.25x1.25",
    dimensions: "57.2x31.8 mm (2.25x1.25 in)",
    pixels: "457x254px @ 203 DPI",
    category: "Etsy",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 110,
    name: "Etsy 4x2",
    dimensions: "101.6x50.8 mm (4x2 in)",
    pixels: "812x406px @ 203 DPI",
    category: "Etsy",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 111,
    name: "Etsy A6",
    dimensions: "105x148 mm (4.13x5.83 in)",
    pixels: "1240x1748px @ 300 DPI",
    category: "Etsy",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 112,
    name: "Etsy 3x1 Banner",
    dimensions: "76.2x25.4 mm (3x1 in)",
    pixels: "610x203px @ 203 DPI",
    category: "Etsy",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 113,
    name: "Etsy 1.5x1",
    dimensions: "38.1x25.4 mm (1.5x1 in)",
    pixels: "305x203px @ 203 DPI",
    category: "Etsy",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 114,
    name: "Etsy Oval 2x1",
    dimensions: "50.8x25.4 mm (2x1 in)",
    pixels: "406x203px @ 203 DPI",
    category: "Etsy",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 115,
    name: "Etsy Heart 1.5in",
    dimensions: "38.1mm (1.5 in)",
    pixels: "305x305px @ 203 DPI",
    category: "Etsy",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },

  // Shipping Carriers - UPS (10 labels)
  {
    id: 116,
    name: "UPS 4x6 Thermal",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO", "Rollo"],
    popular: true,
  },
  {
    id: 117,
    name: "UPS 4x8",
    dimensions: "101.6x203.2 mm (4x8 in)",
    pixels: "812x1625px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 118,
    name: "UPS Letter",
    dimensions: "215.9x279.4 mm (8.5x11 in)",
    pixels: "2550x3300px @ 300 DPI",
    category: "Shipping",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 119,
    name: "UPS Half Letter",
    dimensions: "215.9x139.7 mm (8.5x5.5 in)",
    pixels: "2550x1650px @ 300 DPI",
    category: "Shipping",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 120,
    name: "UPS Ground 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 121,
    name: "UPS Express 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 122,
    name: "UPS International 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 123,
    name: "UPS Return 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 124,
    name: "UPS 4x6.75",
    dimensions: "101.6x171.5 mm (4x6.75 in)",
    pixels: "812x1372px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 125,
    name: "UPS Hazmat",
    dimensions: "101.6x101.6 mm (4x4 in)",
    pixels: "812x812px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },

  // Shipping Carriers - FedEx (10 labels)
  {
    id: 126,
    name: "FedEx 4x6 Thermal",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO", "Rollo"],
    popular: true,
  },
  {
    id: 127,
    name: "FedEx 4x8",
    dimensions: "101.6x203.2 mm (4x8 in)",
    pixels: "812x1625px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 128,
    name: "FedEx Letter",
    dimensions: "215.9x279.4 mm (8.5x11 in)",
    pixels: "2550x3300px @ 300 DPI",
    category: "Shipping",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 129,
    name: "FedEx Half Letter",
    dimensions: "215.9x139.7 mm (8.5x5.5 in)",
    pixels: "2550x1650px @ 300 DPI",
    category: "Shipping",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 130,
    name: "FedEx Ground 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 131,
    name: "FedEx Express 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 132,
    name: "FedEx International 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 133,
    name: "FedEx SmartPost 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 134,
    name: "FedEx 4x6.75",
    dimensions: "101.6x171.5 mm (4x6.75 in)",
    pixels: "812x1372px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 135,
    name: "FedEx Hazmat",
    dimensions: "101.6x101.6 mm (4x4 in)",
    pixels: "812x812px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },

  // Shipping Carriers - USPS (10 labels)
  {
    id: 136,
    name: "USPS 4x6 Thermal",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO", "Rollo"],
    popular: true,
  },
  {
    id: 137,
    name: "USPS Priority Mail 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 138,
    name: "USPS First Class 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 139,
    name: "USPS Media Mail 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 140,
    name: "USPS Parcel Select 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 141,
    name: "USPS Letter",
    dimensions: "215.9x279.4 mm (8.5x11 in)",
    pixels: "2550x3300px @ 300 DPI",
    category: "Shipping",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 142,
    name: "USPS Half Letter",
    dimensions: "215.9x139.7 mm (8.5x5.5 in)",
    pixels: "2550x1650px @ 300 DPI",
    category: "Shipping",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 143,
    name: "USPS International 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 144,
    name: "USPS 4x6.75",
    dimensions: "101.6x171.5 mm (4x6.75 in)",
    pixels: "812x1372px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 145,
    name: "USPS Return 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },

  // Shipping Carriers - DHL (5 labels)
  {
    id: 146,
    name: "DHL 4x6 Thermal",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO", "Rollo"],
    popular: true,
  },
  {
    id: 147,
    name: "DHL Express 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 148,
    name: "DHL International 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 149,
    name: "DHL eCommerce 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "Shipping",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 150,
    name: "DHL Letter",
    dimensions: "215.9x279.4 mm (8.5x11 in)",
    pixels: "2550x3300px @ 300 DPI",
    category: "Shipping",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },

  // DYMO/Desktop (25 labels)
  {
    id: 151,
    name: "DYMO 30252 Address",
    dimensions: "28.6x89 mm (1.125x3.5 in)",
    pixels: "230x711px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 152,
    name: "DYMO 30256 Shipping",
    dimensions: "59x102 mm (2.31x4 in)",
    pixels: "470x812px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
    popular: true,
  },
  {
    id: 153,
    name: "DYMO 30321 Large Address",
    dimensions: "36x89 mm (1.4x3.5 in)",
    pixels: "288x711px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 154,
    name: "DYMO 30323 Shipping",
    dimensions: "54x101 mm (2.125x4 in)",
    pixels: "431x812px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 155,
    name: "DYMO 30324 Diskette",
    dimensions: "54x70 mm (2.125x2.75 in)",
    pixels: "431x558px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 156,
    name: "DYMO 30327 File Folder",
    dimensions: "21x87 mm (0.81x3.44 in)",
    pixels: "164x694px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 157,
    name: "DYMO 30330 Return Address",
    dimensions: "19x51 mm (0.75x2 in)",
    pixels: "152x406px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 158,
    name: "DYMO 30332 Multipurpose",
    dimensions: "25x25 mm (1x1 in)",
    pixels: "203x203px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 159,
    name: "DYMO 30333 Multipurpose",
    dimensions: "13x25 mm (0.5x1 in)",
    pixels: "102x203px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 160,
    name: "DYMO 30334 Multipurpose",
    dimensions: "32x57 mm (1.25x2.25 in)",
    pixels: "254x457px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 161,
    name: "DYMO 30336 Multipurpose",
    dimensions: "25x54 mm (1x2.125 in)",
    pixels: "203x431px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 162,
    name: "DYMO 30346 Library Barcode",
    dimensions: "13x51 mm (0.5x2 in)",
    pixels: "102x406px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 163,
    name: "DYMO 30347 Book Spine",
    dimensions: "19x51 mm (0.75x2 in)",
    pixels: "152x406px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 164,
    name: "DYMO 30364 Name Badge",
    dimensions: "60x89 mm (2.375x3.5 in)",
    pixels: "482x711px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 165,
    name: "DYMO 30370 Zip Disk",
    dimensions: "51x51 mm (2x2 in)",
    pixels: "406x406px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 166,
    name: "DYMO 30373 Price Tag",
    dimensions: "23x51 mm (0.875x2 in)",
    pixels: "178x406px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 167,
    name: "DYMO 30374 Appointment",
    dimensions: "51x51 mm (2x2 in)",
    pixels: "406x406px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 168,
    name: "DYMO 30854 CD/DVD",
    dimensions: "57mm diameter (2.25 in)",
    pixels: "457x457px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 169,
    name: "DYMO 30856 Badge",
    dimensions: "62x106 mm (2.44x4.19 in)",
    pixels: "495x847px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 170,
    name: "DYMO 30857 Name Badge",
    dimensions: "57x102 mm (2.25x4 in)",
    pixels: "457x812px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 171,
    name: "DYMO 30886 Internet Postage",
    dimensions: "63x190 mm (2.5x7.5 in)",
    pixels: "508x1524px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter"],
  },
  {
    id: 172,
    name: "DYMO 1744907 XL Shipping",
    dimensions: "104x159 mm (4.09x6.25 in)",
    pixels: "832x1270px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter XL"],
  },
  {
    id: 173,
    name: "DYMO 1755120 XL Shipping",
    dimensions: "104x159 mm (4.09x6.25 in)",
    pixels: "832x1270px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter XL"],
  },
  {
    id: 174,
    name: "DYMO 1785353 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter 4XL"],
  },
  {
    id: 175,
    name: "DYMO 2026405 LW 5XL",
    dimensions: "104x159 mm (4.09x6.25 in)",
    pixels: "832x1270px @ 203 DPI",
    category: "DYMO",
    printMethod: "Desktop",
    printers: ["DYMO LabelWriter 5XL"],
  },

  // Barcode/Sticker (30 labels)
  {
    id: 176,
    name: "Barcode 1x2 Standard",
    dimensions: "25.4x50.8 mm (1x2 in)",
    pixels: "203x406px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO", "Zebra", "Brother"],
  },
  {
    id: 177,
    name: "Barcode 2x1 Wide",
    dimensions: "50.8x25.4 mm (2x1 in)",
    pixels: "406x203px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO", "Zebra"],
  },
  {
    id: 178,
    name: "Barcode 1.5x0.5 Small",
    dimensions: "38.1x12.7 mm (1.5x0.5 in)",
    pixels: "305x102px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 179,
    name: "Barcode 2x3 Large",
    dimensions: "50.8x76.2 mm (2x3 in)",
    pixels: "406x610px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO"],
  },
  {
    id: 180,
    name: "Barcode 3x1 Strip",
    dimensions: "76.2x25.4 mm (3x1 in)",
    pixels: "610x203px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO", "Zebra"],
  },
  {
    id: 181,
    name: "Round Sticker 1in",
    dimensions: "25.4mm diameter (1 in)",
    pixels: "203x203px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 182,
    name: "Round Sticker 1.5in",
    dimensions: "38.1mm diameter (1.5 in)",
    pixels: "305x305px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 183,
    name: "Round Sticker 2in",
    dimensions: "50.8mm diameter (2 in)",
    pixels: "406x406px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 184,
    name: "Round Sticker 2.5in",
    dimensions: "63.5mm diameter (2.5 in)",
    pixels: "508x508px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },
  {
    id: 185,
    name: "Round Sticker 3in",
    dimensions: "76.2mm diameter (3 in)",
    pixels: "610x610px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },
  {
    id: 186,
    name: "Square 1x1",
    dimensions: "25.4x25.4 mm (1x1 in)",
    pixels: "203x203px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 187,
    name: "Square 1.5x1.5",
    dimensions: "38.1x38.1 mm (1.5x1.5 in)",
    pixels: "305x305px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 188,
    name: "Square 2x2",
    dimensions: "50.8x50.8 mm (2x2 in)",
    pixels: "406x406px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO", "Zebra"],
  },
  {
    id: 189,
    name: "Square 3x3",
    dimensions: "76.2x76.2 mm (3x3 in)",
    pixels: "610x610px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },
  {
    id: 190,
    name: "Square 4x4",
    dimensions: "101.6x101.6 mm (4x4 in)",
    pixels: "812x812px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 191,
    name: "Oval 1x2",
    dimensions: "25.4x50.8 mm (1x2 in)",
    pixels: "203x406px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 192,
    name: "Oval 1.5x3",
    dimensions: "38.1x76.2 mm (1.5x3 in)",
    pixels: "305x610px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO", "Zebra"],
  },
  {
    id: 193,
    name: "Oval 2x4",
    dimensions: "50.8x101.6 mm (2x4 in)",
    pixels: "406x812px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },
  {
    id: 194,
    name: "QR Code 1x1",
    dimensions: "25.4x25.4 mm (1x1 in)",
    pixels: "203x203px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 195,
    name: "QR Code 1.5x1.5",
    dimensions: "38.1x38.1 mm (1.5x1.5 in)",
    pixels: "305x305px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 196,
    name: "QR Code 2x2",
    dimensions: "50.8x50.8 mm (2x2 in)",
    pixels: "406x406px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO", "Zebra"],
  },
  {
    id: 197,
    name: "UPC Barcode 1.5x1",
    dimensions: "38.1x25.4 mm (1.5x1 in)",
    pixels: "305x203px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 198,
    name: "UPC Barcode 2x1",
    dimensions: "50.8x25.4 mm (2x1 in)",
    pixels: "406x203px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO", "Zebra"],
  },
  {
    id: 199,
    name: "EAN-13 Barcode",
    dimensions: "37.3x25.9 mm (1.47x1.02 in)",
    pixels: "298x207px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO", "Zebra"],
  },
  {
    id: 200,
    name: "Code 128 Barcode",
    dimensions: "50.8x12.7 mm (2x0.5 in)",
    pixels: "406x102px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO", "Zebra"],
  },
  {
    id: 201,
    name: "ITF-14 Barcode",
    dimensions: "142.8x32 mm (5.62x1.26 in)",
    pixels: "1142x256px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },
  {
    id: 202,
    name: "Barcode 2.25x1.25",
    dimensions: "57.2x31.8 mm (2.25x1.25 in)",
    pixels: "457x254px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO", "Zebra"],
  },
  {
    id: 203,
    name: "Barcode 2.25x0.75",
    dimensions: "57.2x19.1 mm (2.25x0.75 in)",
    pixels: "457x152px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 204,
    name: "Barcode 3x2",
    dimensions: "76.2x50.8 mm (3x2 in)",
    pixels: "610x406px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO"],
  },
  {
    id: 205,
    name: "Barcode 4x1",
    dimensions: "101.6x25.4 mm (4x1 in)",
    pixels: "812x203px @ 203 DPI",
    category: "Barcode",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },

  // International (30 labels)
  {
    id: 206,
    name: "UK Royal Mail A6",
    dimensions: "105x148 mm (4.13x5.83 in)",
    pixels: "1240x1748px @ 300 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Brother"],
  },
  {
    id: 207,
    name: "UK Royal Mail 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 208,
    name: "UK Royal Mail A4",
    dimensions: "210x297 mm (8.27x11.69 in)",
    pixels: "2480x3508px @ 300 DPI",
    category: "International",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 209,
    name: "EU DPD A6",
    dimensions: "105x148 mm (4.13x5.83 in)",
    pixels: "1240x1748px @ 300 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Brother"],
  },
  {
    id: 210,
    name: "EU DPD 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 211,
    name: "EU GLS A6",
    dimensions: "105x148 mm (4.13x5.83 in)",
    pixels: "1240x1748px @ 300 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Brother"],
  },
  {
    id: 212,
    name: "EU Hermes A6",
    dimensions: "105x148 mm (4.13x5.83 in)",
    pixels: "1240x1748px @ 300 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Brother"],
  },
  {
    id: 213,
    name: "EU PostNL A6",
    dimensions: "105x148 mm (4.13x5.83 in)",
    pixels: "1240x1748px @ 300 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Brother"],
  },
  {
    id: 214,
    name: "EU A5",
    dimensions: "148x210 mm (5.83x8.27 in)",
    pixels: "1748x2480px @ 300 DPI",
    category: "International",
    printMethod: "Inkjet",
    printers: ["HP", "Canon", "Epson"],
  },
  {
    id: 215,
    name: "EU A4",
    dimensions: "210x297 mm (8.27x11.69 in)",
    pixels: "2480x3508px @ 300 DPI",
    category: "International",
    printMethod: "Inkjet",
    printers: ["HP", "Canon", "Epson"],
  },
  {
    id: 216,
    name: "Australia Post 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 217,
    name: "Australia Post A6",
    dimensions: "105x148 mm (4.13x5.83 in)",
    pixels: "1240x1748px @ 300 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Brother"],
  },
  {
    id: 218,
    name: "Canada Post 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 219,
    name: "Canada Post Letter",
    dimensions: "215.9x279.4 mm (8.5x11 in)",
    pixels: "2550x3300px @ 300 DPI",
    category: "International",
    printMethod: "Inkjet",
    printers: ["HP", "Canon"],
  },
  {
    id: 220,
    name: "Japan Post 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 221,
    name: "Japan Post A6",
    dimensions: "105x148 mm (4.13x5.83 in)",
    pixels: "1240x1748px @ 300 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Brother"],
  },
  {
    id: 222,
    name: "China Post 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 223,
    name: "India Post 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 224,
    name: "Germany DHL A6",
    dimensions: "105x148 mm (4.13x5.83 in)",
    pixels: "1240x1748px @ 300 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Brother"],
  },
  {
    id: 225,
    name: "France Colissimo A6",
    dimensions: "105x148 mm (4.13x5.83 in)",
    pixels: "1240x1748px @ 300 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Brother"],
  },
  {
    id: 226,
    name: "Spain Correos A6",
    dimensions: "105x148 mm (4.13x5.83 in)",
    pixels: "1240x1748px @ 300 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Brother"],
  },
  {
    id: 227,
    name: "Italy Poste A6",
    dimensions: "105x148 mm (4.13x5.83 in)",
    pixels: "1240x1748px @ 300 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Brother"],
  },
  {
    id: 228,
    name: "Brazil Correios 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 229,
    name: "Mexico Post 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 230,
    name: "Singapore Post 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 231,
    name: "Korea Post 4x6",
    dimensions: "101.6x152.4 mm (4x6 in)",
    pixels: "812x1218px @ 203 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 232,
    name: "Netherlands PostNL A6",
    dimensions: "105x148 mm (4.13x5.83 in)",
    pixels: "1240x1748px @ 300 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Brother"],
  },
  {
    id: 233,
    name: "Belgium bpost A6",
    dimensions: "105x148 mm (4.13x5.83 in)",
    pixels: "1240x1748px @ 300 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Brother"],
  },
  {
    id: 234,
    name: "Switzerland Post A6",
    dimensions: "105x148 mm (4.13x5.83 in)",
    pixels: "1240x1748px @ 300 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Brother"],
  },
  {
    id: 235,
    name: "Austria Post A6",
    dimensions: "105x148 mm (4.13x5.83 in)",
    pixels: "1240x1748px @ 300 DPI",
    category: "International",
    printMethod: "Thermal",
    printers: ["Zebra", "Brother"],
  },

  // Special/Professional (20+ labels)
  {
    id: 236,
    name: "Hazmat Warning 4x4",
    dimensions: "101.6x101.6 mm (4x4 in)",
    pixels: "812x812px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },
  {
    id: 237,
    name: "Fragile Warning 3x2",
    dimensions: "76.2x50.8 mm (3x2 in)",
    pixels: "610x406px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 238,
    name: "This Side Up 3x2",
    dimensions: "76.2x50.8 mm (3x2 in)",
    pixels: "610x406px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 239,
    name: "Handle With Care 3x2",
    dimensions: "76.2x50.8 mm (3x2 in)",
    pixels: "610x406px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 240,
    name: "Do Not Stack 4x4",
    dimensions: "101.6x101.6 mm (4x4 in)",
    pixels: "812x812px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },
  {
    id: 241,
    name: "Keep Frozen 3x3",
    dimensions: "76.2x76.2 mm (3x3 in)",
    pixels: "610x610px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO"],
  },
  {
    id: 242,
    name: "Keep Refrigerated 3x3",
    dimensions: "76.2x76.2 mm (3x3 in)",
    pixels: "610x610px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["Zebra", "DYMO"],
  },
  {
    id: 243,
    name: "Suffocation Warning 3x2",
    dimensions: "76.2x50.8 mm (3x2 in)",
    pixels: "610x406px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 244,
    name: "Made in USA 2x2",
    dimensions: "50.8x50.8 mm (2x2 in)",
    pixels: "406x406px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 245,
    name: "Organic Certified 2x2",
    dimensions: "50.8x50.8 mm (2x2 in)",
    pixels: "406x406px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 246,
    name: "QC Passed 1.5x1.5",
    dimensions: "38.1x38.1 mm (1.5x1.5 in)",
    pixels: "305x305px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 247,
    name: "QC Reject 1.5x1.5",
    dimensions: "38.1x38.1 mm (1.5x1.5 in)",
    pixels: "305x305px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 248,
    name: "Inventory Tag 2x4",
    dimensions: "50.8x101.6 mm (2x4 in)",
    pixels: "406x812px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["DYMO", "Zebra"],
  },
  {
    id: 249,
    name: "Asset Tag 2x1",
    dimensions: "50.8x25.4 mm (2x1 in)",
    pixels: "406x203px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["DYMO", "Brother"],
  },
  {
    id: 250,
    name: "Warranty Void 2x1",
    dimensions: "50.8x25.4 mm (2x1 in)",
    pixels: "406x203px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["DYMO"],
  },
  {
    id: 251,
    name: "Serial Number 3x1",
    dimensions: "76.2x25.4 mm (3x1 in)",
    pixels: "610x203px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["DYMO", "Zebra"],
  },
  {
    id: 252,
    name: "Pallet Label 6x4",
    dimensions: "152.4x101.6 mm (6x4 in)",
    pixels: "1218x812px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },
  {
    id: 253,
    name: "Bin Label 4x2",
    dimensions: "101.6x50.8 mm (4x2 in)",
    pixels: "812x406px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["Zebra", "Rollo"],
  },
  {
    id: 254,
    name: "Rack Label 8x2",
    dimensions: "203.2x50.8 mm (8x2 in)",
    pixels: "1625x406px @ 203 DPI",
    category: "Special",
    printMethod: "Thermal",
    printers: ["Zebra"],
  },
  {
    id: 255,
    name: "Custom Size",
    dimensions: "Variable",
    pixels: "Variable @ 203-300 DPI",
    category: "Special",
    printMethod: "All",
    printers: ["All printers"],
  },
]

const categories = [
  { id: "all", name: "All Labels", count: 255 },
  { id: "Amazon FBA", name: "Amazon FBA", count: 25 },
  { id: "Walmart", name: "Walmart", count: 20 },
  { id: "eBay", name: "eBay", count: 18 },
  { id: "Shopify", name: "Shopify", count: 30 },
  { id: "Etsy", name: "Etsy", count: 22 },
  { id: "Shipping", name: "Shipping", count: 35 },
  { id: "DYMO", name: "DYMO/Desktop", count: 25 },
  { id: "Barcode", name: "Barcode/Sticker", count: 30 },
  { id: "International", name: "International", count: 30 },
  { id: "Special", name: "Special", count: 20 },
]

const printMethods = ["Thermal", "Inkjet", "Desktop", "All"]

const categoryColors: Record<string, string> = {
  "Amazon FBA": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Walmart: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  eBay: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Shopify: "bg-green-500/20 text-green-400 border-green-500/30",
  Etsy: "bg-orange-400/20 text-orange-300 border-orange-400/30",
  Shipping: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  DYMO: "bg-red-500/20 text-red-400 border-red-500/30",
  Barcode: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  International: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  Special: "bg-pink-500/20 text-pink-400 border-pink-500/30",
}

const printMethodColors: Record<string, string> = {
  Thermal: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Inkjet: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Desktop: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  All: "bg-gray-500/20 text-gray-400 border-gray-500/30",
}

const ITEMS_PER_PAGE = 20

export function LabelsPageContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPrintMethods, setSelectedPrintMethods] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [showFilters, setShowFilters] = useState(false)

  const filteredLabels = useMemo(() => {
    return allLabels.filter((label) => {
      const matchesSearch =
        searchQuery === "" ||
        label.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        label.dimensions.toLowerCase().includes(searchQuery.toLowerCase()) ||
        label.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || label.category === selectedCategory

      const matchesPrintMethod = selectedPrintMethods.length === 0 || selectedPrintMethods.includes(label.printMethod)

      return matchesSearch && matchesCategory && matchesPrintMethod
    })
  }, [searchQuery, selectedCategory, selectedPrintMethods])

  const visibleLabels = filteredLabels.slice(0, visibleCount)
  const hasMore = visibleCount < filteredLabels.length

  const popularLabels = allLabels.filter((l) => l.popular)

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredLabels.length))
  }, [filteredLabels.length])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedPrintMethods([])
    setVisibleCount(ITEMS_PER_PAGE)
  }

  const activeFilterCount = (selectedCategory !== "all" ? 1 : 0) + selectedPrintMethods.length

  const togglePrintMethod = (method: string) => {
    setSelectedPrintMethods((prev) => (prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]))
    setVisibleCount(ITEMS_PER_PAGE)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary/50 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">255+ Label Formats</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            255+ Professional Label Formats
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Amazon FBA, Walmart, eBay, Shopify, Etsy, and all major shipping carriers. Find the perfect label format for
            your business.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by label name, dimensions, or marketplace..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setVisibleCount(ITEMS_PER_PAGE)
              }}
              className="pl-12 pr-12 h-14 text-lg bg-card border-border rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {searchQuery && (
            <p className="mt-4 text-muted-foreground">
              Found <span className="text-foreground font-medium">{filteredLabels.length}</span> labels matching &quot;
              {searchQuery}&quot;
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/signup">
                Start Designing <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/#pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Labels */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Popular Labels</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {popularLabels.map((label) => (
              <button
                key={label.id}
                onClick={() => {
                  setSearchQuery(label.name)
                  setVisibleCount(ITEMS_PER_PAGE)
                }}
                className="flex-shrink-0 px-4 py-2 rounded-lg bg-card border border-border hover:border-accent/50 transition-colors"
              >
                <span className="text-sm font-medium text-foreground">{label.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id)
                          setVisibleCount(ITEMS_PER_PAGE)
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat.id
                            ? "bg-accent/10 text-accent"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs">{cat.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Print Method */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Print Method</h3>
                  <div className="space-y-2">
                    {printMethods.slice(0, 3).map((method) => (
                      <label key={method} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedPrintMethods.includes(method)}
                          onCheckedChange={() => togglePrintMethod(method)}
                        />
                        <span className="text-sm text-muted-foreground">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
                    Clear all filters
                  </Button>
                )}
              </div>
            </aside>

            {/* Main Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="text-foreground font-medium">{visibleLabels.length}</span> of{" "}
                    <span className="text-foreground font-medium">{filteredLabels.length}</span> labels
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mobile Filter Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>

                  {/* View Mode Toggle */}
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${viewMode === "grid" ? "bg-secondary" : ""}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${viewMode === "list" ? "bg-secondary" : ""}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <div className="lg:hidden mb-6 p-4 bg-card rounded-xl border border-border">
                  {/* Category Tabs */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Category</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.slice(0, 6).map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id)
                            setVisibleCount(ITEMS_PER_PAGE)
                          }}
                          className={`px-3 py-1 rounded-full text-xs ${
                            selectedCategory === cat.id
                              ? "bg-accent text-accent-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Print Method */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Print Method</h4>
                    <div className="flex flex-wrap gap-2">
                      {printMethods.slice(0, 3).map((method) => (
                        <button
                          key={method}
                          onClick={() => togglePrintMethod(method)}
                          className={`px-3 py-1 rounded-full text-xs ${
                            selectedPrintMethods.includes(method)
                              ? "bg-accent text-accent-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-4">
                      Clear all filters
                    </Button>
                  )}
                </div>
              )}

              {/* Category Tabs - Desktop */}
              <div className="hidden lg:flex gap-2 mb-6 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id)
                      setVisibleCount(ITEMS_PER_PAGE)
                    }}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.name} ({cat.count})
                  </button>
                ))}
              </div>

              {/* Labels Grid/List */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {visibleLabels.map((label) => (
                    <LabelCard key={label.id} label={label} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleLabels.map((label) => (
                    <LabelListItem key={label.id} label={label} />
                  ))}
                </div>
              )}

              {/* Load More */}
              {hasMore && (
                <div className="mt-8 text-center">
                  <Button variant="outline" size="lg" onClick={loadMore}>
                    Load More Labels
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* Empty State */}
              {filteredLabels.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-lg text-muted-foreground mb-4">No labels found matching your criteria.</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Printer Compatibility */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Printer Compatibility</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our labels work with all major thermal and inkjet printers
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {["Zebra", "DYMO", "Rollo", "Brother", "HP", "Canon"].map((printer) => (
              <div
                key={printer}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border"
              >
                <Printer className="w-10 h-10 text-muted-foreground" />
                <span className="font-medium text-foreground">{printer}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            {[
              {
                q: "What label formats do you support?",
                a: "We support 255+ label formats including Amazon FBA, Walmart, eBay, Shopify, Etsy, and all major shipping carriers like UPS, FedEx, USPS, and DHL.",
              },
              {
                q: "Which printers are compatible?",
                a: "Our labels work with all major thermal printers (Zebra, DYMO, Rollo, Brother) and inkjet printers (HP, Canon, Epson).",
              },
              {
                q: "Can I request a custom label format?",
                a: "Yes! Contact our support team to request any custom label format you need.",
              },
              {
                q: "What DPI settings are supported?",
                a: "We support 203 DPI (standard thermal) and 300 DPI (high resolution inkjet) for all label formats.",
              },
            ].map((faq, index) => (
              <div key={index} className="p-6 rounded-xl bg-card border border-border">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Clock className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Recently Added</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allLabels
              .slice(-4)
              .reverse()
              .map((label) => (
                <LabelCard key={label.id} label={label} />
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}

interface LabelCardProps {
  label: (typeof allLabels)[0]
}

function LabelCard({ label }: LabelCardProps) {
  // Extract dimensions for preview
  const dimensionMatch = label.dimensions.match(/$$([^)]+)$$/)
  const shortDimension = dimensionMatch ? dimensionMatch[1] : label.dimensions

  return (
    <div className="group p-4 rounded-xl bg-card border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300">
      {/* Label Preview */}
      <div className="relative aspect-[3/4] mb-4 rounded-lg bg-secondary/50 flex items-center justify-center overflow-hidden">
        <div className="w-12 h-16 border-2 border-dashed border-muted-foreground/30 rounded flex items-center justify-center">
          <span className="text-[10px] text-muted-foreground font-mono">{shortDimension}</span>
        </div>
        {label.popular && (
          <Badge className="absolute top-2 right-2 bg-accent/90 text-accent-foreground text-[10px]">Popular</Badge>
        )}
      </div>

      {/* Label Info */}
      <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">{label.name}</h3>
      <p className="text-xs text-muted-foreground mb-2">{label.dimensions}</p>
      <p className="text-xs text-muted-foreground mb-3">{label.pixels}</p>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${categoryColors[label.category] || ""}`}>
          {label.category}
        </Badge>
        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${printMethodColors[label.printMethod] || ""}`}>
          {label.printMethod}
        </Badge>
      </div>

      {/* Printers */}
      <p className="text-[10px] text-muted-foreground mb-3 line-clamp-1">
        <Printer className="w-3 h-3 inline mr-1" />
        {label.printers.join(", ")}
      </p>

      {/* CTA */}
      <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
        <Link href="/signup">Use This Label</Link>
      </Button>
    </div>
  )
}

function LabelListItem({ label }: LabelCardProps) {
  const dimensionMatch = label.dimensions.match(/$$([^)]+)$$/)
  const shortDimension = dimensionMatch ? dimensionMatch[1] : label.dimensions

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent/50 transition-colors">
      {/* Preview */}
      <div className="w-16 h-20 flex-shrink-0 rounded-lg bg-secondary/50 flex items-center justify-center">
        <div className="w-8 h-10 border border-dashed border-muted-foreground/30 rounded flex items-center justify-center">
          <span className="text-[8px] text-muted-foreground font-mono">{shortDimension}</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-foreground text-sm truncate">{label.name}</h3>
          {label.popular && <Badge className="bg-accent/90 text-accent-foreground text-[10px]">Popular</Badge>}
        </div>
        <p className="text-xs text-muted-foreground mb-1">{label.dimensions}</p>
        <p className="text-xs text-muted-foreground mb-2">{label.pixels}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${categoryColors[label.category] || ""}`}>
            {label.category}
          </Badge>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${printMethodColors[label.printMethod] || ""}`}>
            {label.printMethod}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            <Printer className="w-3 h-3 inline mr-1" />
            {label.printers.slice(0, 2).join(", ")}
          </span>
        </div>
      </div>

      {/* CTA */}
      <Button size="sm" className="flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
        <Link href="/signup">Use Label</Link>
      </Button>
    </div>
  )
}
