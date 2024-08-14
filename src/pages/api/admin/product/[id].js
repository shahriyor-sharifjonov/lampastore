import clientPromise from '@/lib/mongodb'

import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"


const def = async (req, res) => {
    switch(req.method){
        case 'DELETE':
            await deleteProduct(req, res)
            break
        case 'PUT':
            await updateProduct(req, res)
            break 
        default:
            res.setHeader('Allow', ['DELETE', 'PUT']);
            res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}

const deleteProduct = async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    const client = await clientPromise;
    const db = client.db();

    if (!session || session.user.role !== 'admin') {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    
    const { query: { id } } = req;

    try {
        await db.collection("products").deleteOne({ _id: new ObjectId(id) })

        const result = await db.collection("products").find().toArray()
    
        res.status(200).json(result)
    } catch (error) {
        console.error("Error occurred:", error)
        res.status(500).json({ error: error })
    }
}


const updateProduct = async (req, res) => {
    try {
        const session = await getServerSession(req, res, authOptions);
        const client = await clientPromise;
        const db = client.db();
    
        if (!session || session.user.role !== 'admin') {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
    
        const { query: { id } } = req;
        const { title, description, category, subcategory, fields, images, price, kom, vip } = req.body;
        const oldProduct = await db.collection('products').findOne({ _id: new ObjectId(id) });

        if (!oldProduct) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
    
        if (!title || !category || !fields || !price || !images[0]) {
            res.status(400).json({ message: 'Add all fields' });
            return;
        }
    
        const result = await db.collection('products').findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    title: title,
                    description: description,
                    price: price,
                    category: category,
                    subcategory: subcategory,
                    images: images,
                    fields: fields,
                    kom: kom,
                    vip: vip,
                    updated_at: new Date(),
                },
            },
            { returnOriginal: false }
        );
  
        if (result.value) {
            const products = await db.collection("products").find().toArray();
            res.status(200).json({"result": result.value, products});
        } else {
            res.status(404).json({ message: 'Product not found or not updated' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: error });
    }
};


export default def