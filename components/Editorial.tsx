export default function Editorial({title,children}:{title:string;children?:React.ReactNode}){return <div className="container py-24 max-w-5xl"><p className="eyebrow">Krean journal</p><h1 className="text-6xl mt-4">{title}</h1><div className="mt-10 text-xl leading-relaxed">{children??'Thoughtful guidance for a considered jewellery journey. Check back soon for new stories.'}</div></div>}

