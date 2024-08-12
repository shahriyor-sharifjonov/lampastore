import clientPromise from '@/lib/mongodb';

const def = async (req, res) => {
  switch(req.method){
    case 'GET':
      await getPromocode(req, res)
      break;
  }
}

const getPromocode = async (req, res) => {
  try {
    const client = await clientPromise
    const db = client.db()

    const promocode = await db.collection('promocode').find().sort({ num: 1 }).toArray()
    res.status(200).json(promocode)
  }
  catch (err) {
    return res.status(500).json({err: err.message})
  }
}

export default def