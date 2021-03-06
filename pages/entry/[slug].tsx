import { GetStaticProps, InferGetStaticPropsType, GetStaticPaths } from 'next'
import Link from 'next/link'

import { Layout } from '@components/Layout'
import { Grid } from '@ui/Grid'
import { Typography } from '@ui/Typography'
import { RichText } from '@components/RichText'
import { AuthorCard } from '@components/AuthorCard'
import { getPlant, getPlantList, getCategoryList } from '@api'
import { PlantEntryInline } from '@components/PlantCollection'
import { Image } from '@components/Image'

type PlantEntryProps = {
  plant: Plant,
  otherEntries: Plant[]
  categories: Category[]
}

export const getStaticProps: GetStaticProps<PlantEntryProps> = async ({ params }) => {
  const slug = params?.slug
  if (typeof slug !== 'string')
    return {
      notFound: true
    }

  try {
    const plant = await getPlant(slug)
    const otherEntries = await getPlantList({
      limit: 5,
    })
    const categories = await getCategoryList({ limit: 10 })
    return {
      props: {
        plant,
        otherEntries,
        categories
      },
      revalidate: 5 * 60
    }
  } catch(err) {
    return {
      notFound: true
    }
  }
}

type PathType = {
  params: {
    slug: string
  }
}
export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getPlantList({ limit: 10 })
  const paths: PathType[] = entries.map((plant) => ({
    params: {
      slug: plant.slug
    }
  }))
  return {
    paths,
    fallback: 'blocking'
  }
}

export default function PlantEntry({ plant, otherEntries, categories }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={9} component="article">
          <figure>
            <Image width={952} src={plant.image.url} aspectRatio='4:3' layout='intrinsic' alt={plant.image.title} />
          </figure>
          <div className="px-12 pt-8">
            <Typography variant="h2">{plant.plantName}</Typography>
          </div>
          <div className="p-10">
            <RichText richText={plant.description} />
          </div>
        </Grid>
        <Grid item xs={12} md={4} lg={3} component="aside">
          <section>
            <Typography variant="h5" component="h3" className="mb-4">
              Recent posts
            </Typography>
            {otherEntries.map((plantEntry) => (
              <article className="mb-4" key={plantEntry.id}>
                <PlantEntryInline {...plantEntry} />
              </article>
            ))}
          </section>
          <section className="mt-10">
            <Typography variant="h5" component="h3" className="mb-4">
              Categories
            </Typography>
            <ul className="list">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link passHref href={`/category/${category.slug}`}>
                    <Typography component="a" variant="h6">
                      {category.title}
                    </Typography>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Grid>
      </Grid>
      <section className="my-4 border-t-2 border-b-2 border-gray-200 pt-12 pb-7">
        <AuthorCard {...plant.author} />
      </section>
    </Layout>
  )
}
