import { createStorefrontApiClient } from '@shopify/storefront-api-client';
export type Image={url:string;altText?:string|null};
export type Product={id:string;title:string;handle:string;description:string;featuredImage?:Image;priceRange:{minVariantPrice:{amount:string;currencyCode:string}}};
export type Collection={id:string;title:string;handle:string;description:string;image?:Image;products:{nodes:Product[]}};
export type Article={id:string;title:string;handle:string;excerpt:string;contentHtml:string;publishedAt:string;image?:Image};
export type Blog={id:string;title:string;handle:string;articles:{nodes:Article[]}};
export type Page={id:string;title:string;handle:string;body:string;bodySummary:string};
export type Policy={id:string;title:string;handle:string;body:string;url:string};
const client=()=>{const domain=process.env.SHOPIFY_STORE_DOMAIN,token=process.env.SHOPIFY_STOREFRONT_TOKEN;if(!domain||!token)return null;return createStorefrontApiClient({storeDomain:domain,publicAccessToken:token,apiVersion:'2025-01'});};
async function query<T>(text:string,variables:Record<string,unknown>={}):Promise<T|null>{const api=client();if(!api)return null;try{const response=await api.request<T>(text,{variables});return response.data??null;}catch(error){console.error('Shopify request failed',error);return null;}}
const fields=`id title handle description featuredImage{url altText} priceRange{minVariantPrice{amount currencyCode}}`;
export async function getProducts(){const d=await query<{products:{nodes:Product[]}}>(`query{products(first:24){nodes{${fields}}}}`);return d?.products.nodes??[]}
export async function getProduct(handle:string){const d=await query<{product:Product|null}>(`query($handle:String!){product(handle:$handle){${fields}}}`,{handle});return d?.product??null}
export async function getCollections(){const d=await query<{collections:{nodes:Collection[]}}>(`query{collections(first:24){nodes{id title handle description image{url altText} products(first:24){nodes{${fields}}}}}}`);return d?.collections.nodes??[]}
export async function getCollection(handle:string){const d=await query<{collection:Collection|null}>(`query($handle:String!){collection(handle:$handle){id title handle description image{url altText} products(first:24){nodes{${fields}}}}}`,{handle});return d?.collection??null}
export async function getBlogs(){const d=await query<{blogs:{nodes:Blog[]}}>(`query{blogs(first:12){nodes{id title handle articles(first:12){nodes{id title handle excerpt contentHtml publishedAt image{url altText}}}}}}`);return d?.blogs.nodes??[]}
export async function getBlogArticle(blogHandle:string,articleHandle:string){const d=await query<{blog:Blog|null}>(`query($blog:String!,$article:String!){blog(handle:$blog){id title handle articleByHandle(handle:$article){id title handle excerpt contentHtml publishedAt image{url altText}}}}`,{blog:blogHandle,article:articleHandle});return d?.blog??null}
export async function getPage(handle:string){const d=await query<{page:Page|null}>(`query($handle:String!){page(handle:$handle){id title handle body bodySummary}}`,{handle});return d?.page??null}
export async function getPolicies(){const d=await query<{shop:{privacyPolicy?:Policy;refundPolicy?:Policy;shippingPolicy?:Policy;termsOfService?:Policy}}>(`query{shop{privacyPolicy{id title handle body url} refundPolicy{id title handle body url} shippingPolicy{id title handle body url} termsOfService{id title handle body url}}}`);return d?.shop??null}
export async function getPolicy(handle:string){const policies=await getPolicies();return policies?Object.values(policies).find(policy=>policy?.handle===handle)??null:null}
