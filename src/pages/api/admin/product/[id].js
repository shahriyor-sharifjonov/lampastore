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

    if (!session || session.customUser.role !== 'admin') {
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
    
        if (!session || session.customUser.role !== 'admin') {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
    
        const { query: { id } } = req;
        const { name, slug, subcategories } = req.body;
        const oldCategory = await db.collection('categories').findOne({ _id: new ObjectId(id) });

        if (!oldCategory) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
    
        if (!name || !slug) {
            res.status(400).json({ message: 'Add all fields' });
            return;
        }
    
        const result = await db.collection('categories').findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    name: name,
                    slug: slug,
                    subcategories: subcategories,
                },
            },
            { returnOriginal: false }
        );
  
        if (result.value) {
            const updatedCategory = result.value;
    
            const deletedSubcategories = oldCategory.subcategories.filter(subcategory =>
                !subcategories.some(updatedSubcategory => updatedSubcategory.slug === subcategory.slug)
            );
    
            await db.collection('products').deleteMany({
                category: id,
                subcategory: { $in: deletedSubcategories.map(subcategory => subcategory.slug) }
            });
    
            const categories = await db.collection("categories").find().toArray();
            res.status(200).json(categories);
        } else {
            res.status(404).json({ message: 'Product not found or not updated' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: error });
    }
};


export default def