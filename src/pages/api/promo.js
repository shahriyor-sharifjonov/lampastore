import clientPromise from '@/lib/mongodb';

const def = async (req, res) => {
  switch(req.method){
    case 'GET':
      await getPromo(req, res)
      break;
  }
}

const getPromo = async (req, res) => {
  try {
    const client = await clientPromise
    const db = client.db()

    const promo = await db.collection('promo').find().sort({ num: 1 }).toArray()
    res.status(200).json(promo)
  }
  catch (err) {
    return res.status(500).json({err: err.message})
  }
}

export default def