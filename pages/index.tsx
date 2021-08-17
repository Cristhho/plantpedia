import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Layout } from '@components/Layout'
import { PlantCollection } from '@components/PlantCollection'
import { Hero } from '@components/Hero'
import { Authors } from '@components/Authors'
import { getPlantList } from "@api";

type HomeProps = { plants: Plant[] }
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const plants = await getPlantList({ limit:10 })
  return {
    props: {
      plants
    },
    revalidate: 5 * 60
  }
}

export default function Home({ plants }: InferGetStaticPropsType<typeof getStaticProps>) {
  const plant = Math.floor(Math.random() * plants.length) + 0;
  return (
    <Layout>
      <Hero {...plants[plant]} className='mb-20' />
      <Authors className='mb-10' />
      <PlantCollection plants={plants} variant='square' />
    </Layout>
  )
}
