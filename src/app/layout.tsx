import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "@/components/Header";
import { Container } from "react-bootstrap";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Economises",
  description: "A personal blog by Timilehin",
  authors: [{ name: "Timilehin" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} d-flex flex-column min-vh-100`}>
        <Header />
        <main className="flex-fill">{children}</main>
        <footer className="py-5 bg-dark mt-auto">
          <Container>
            <p className="m-0 text-center text-white">
              Copyright &copy; Economises 2025
            </p>
          </Container>
        </footer>
      </body>
    </html>
  );
}
