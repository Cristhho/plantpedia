import { GetStaticProps, InferGetStaticPropsType, GetStaticPaths } from 'next'

import { Layout } from '@components/Layout'
import { Typography } from '@ui/Typography'
import { Alert } from '@ui/Alert'
import { PlantCollection } from '@components/PlantCollection'
import { getCategoryList, getPlantListByCategory } from '@api'

type CategoryProps = {
  entries: Plant[]
  category: Category
}
export const getStaticProps: GetStaticProps<CategoryProps> = async ({ params }) => {
  const slug = params?.categorySlug
  if (typeof slug !== 'string')
    return {
      notFound: true
    }
  
  try {
    const { entries, category } = await getPlantListByCategory({
      category: slug,
      limit: 12
    })

    return {
      props: {
        entries,
        category,
        status: 'success'
      },
      revalidate: 15 * 60
    }
  } catch(err) {
    return {
      notFound: true
    }
  }
}

type PathType = {
  params: {
    categorySlug: string
  }
}
export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await getCategoryList({ limit: 10 })
  const paths: PathType[] = categories.map((category) => ({
    params: {
      categorySlug: category.slug
    }
  }))
  return {
    paths,
    fallback: 'blocking'
  }
}

export default function CategoryPage({ entries, category }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
       <Typography variant="h2" className="text-center mb-12">
        Category: {category.title}
      </Typography>
      <PlantCollection plants={entries} />
      {entries.length > 0 ? null : (
        <Alert severity="info">
          We couldn't find any entry for {category.title}
        </Alert>
      )}
    </Layout>
  )
}
