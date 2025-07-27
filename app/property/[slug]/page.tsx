import PropertyDetailsComponent from "@/components/PropertyDetails";
import { ApiServices } from "@/lib/apiServices";
import { convertArrayObjToString, metaTagParser } from "@/lib/CustomeHelper";
import { ResolvingMetadata } from "next";
import { headers } from "next/headers";
export async function generateMetadata({ params }: any, parent: ResolvingMetadata) {
  const { slug } = await params;
  const headersList = await headers();
  const mainUrl: any = headersList.get('referer');

  // Fetch data based on slug to generate dynamic metadata
  const response: any = await ApiServices.getPropertyDetail(slug);// Assuming fetchPostData is a function you write.
  if (!response) {
    return {
      title: "Page Not Found",
    };
  }
  const keywords: any = await convertArrayObjToString(response?.tags?.concat([response?.propertyType],[response?.builder],[response?.location]));
  return {
    title: await metaTagParser(response?.title, 'title'),
    description: await metaTagParser(response?.description, 'description'),
    keywords: keywords,
    openGraph: {
      title: await metaTagParser(response?.tittle, 'title'),
      description: await metaTagParser(response?.description, 'description'),
      images: response?.images,
      url: mainUrl,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: await metaTagParser(response?.title, 'title'),
      description: await metaTagParser(response?.description, 'description'),
      images: response?.images,
      type: 'website',
      url: mainUrl,
    }
  };
}
export default async function PropertyDetailPage({ params }: any) {
    const {slug}:any = await params;
    const data:any = await ApiServices.getPropertyDetail(slug);
    return(
        <>
            <PropertyDetailsComponent data={data}/>
        </>
    )
}