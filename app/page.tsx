import FeaturedProperties from "@/components/FeaturedProperties"
import NewlyLaunchedProjects from "@/components/NewlyLaunchedProjects"
import DemandPanel from "@/components/DemandPanel"

export default async function Home() {
  return (
    <>
      <FeaturedProperties />
      <NewlyLaunchedProjects />
      <DemandPanel />
    </>
  )
}