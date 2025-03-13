import clientPromise from '@/lib/mongodb';

const def = async (req, res) => {
  switch(req.method){
    case 'GET':
      await getInfo(req, res)
      break;
  }
}

const getInfo = async (req, res) => {
  try {
    const client = await clientPromise
    const db = client.db()

    const info = await db.collection('info').find({}, { projection: { password: 0, logemail: 0 } }).toArray();
    res.status(200).json(info)
  }
  catch (err) {
    return res.status(500).json({err: err.message})
  }
}

export default def