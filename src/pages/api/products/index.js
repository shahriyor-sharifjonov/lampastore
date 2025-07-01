import clientPromise from '@/lib/mongodb';

const def = async (req, res) => {
  switch(req.method){
    case 'GET':
      await getProducts(req, res)
      break;
  }
}

const getProducts = async (req, res) => {
  try {
    const client = await clientPromise
    const db = client.db()

    const { page = 1, limit = 10 } = req.query; // Получение параметров пагинации
    const skip = (parseInt(page) - 1) * parseInt(limit); // Вычисление пропускаемых записей

    const products = await db.collection('products')
      .find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    res.status(200).json(products);
  }
  catch (err) {
    return res.status(500).json({ err: err.message });
  }
}

export default def;