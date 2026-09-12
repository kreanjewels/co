import Editorial from '../../../components/Editorial'; export default function Post({params}:{params:{slug:string}}){return <Editorial title={params.slug.replaceAll('-',' ')}/>}

