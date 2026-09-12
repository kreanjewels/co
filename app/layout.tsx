import './globals.css';
import Header from '../components/Header'; import Footer from '../components/Footer';
export const metadata={title:'Krean Jewels — Jewellery with intention',description:'Thoughtful fine jewellery, made for your story.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Header/><main>{children}</main><Footer/></body></html>}

