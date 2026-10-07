import type { Metadata } from "next";

export default function RootLayout({children}: LayoutProps<"/">) {
    return (
        <html lang = "en" >
            <body>{children}</body>
        </html>
    )
}