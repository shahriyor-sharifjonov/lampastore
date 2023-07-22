import clientPromise from '@/lib/mongodb';

const def = async (req, res) => {
  switch(req.method){
    case 'GET':
      await getCategories(req, res)
      break;
  }
}

const getCategories = async (req, res) => {
  try {
    const client = await clientPromise
    const db = client.db()

    const categories = await db.collection('categories').find().toArray()
    res.status(200).json(categories)
  }
  catch (err) {
    return res.status(500).json({err: err.message})
  }
}

export default def