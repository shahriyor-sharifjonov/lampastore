const tgBotToken = process.env.NEXT_PUBLIC_TG_BOT_TOKEN;
const chatId = process.env.NEXT_PUBLIC_CHAT_ID;

export default async function handler(req, res) {
    try{
        let text = '';
    
        for (const [key, val] of Object.entries(req.body)) {
            if(key === 'Общая цена') {
                text += `Новый заказ на ${Number(val).toLocaleString()} ₽\n-----------------------------------\n`
            } else if (key === 'Товары') {
                const products = val.map(product => ({
                    link: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/product/${product._id}`,
                    title: product.title,
                    quantity: product.quantity,
                    price: product.price,
                    selectedKom: product.selectedKom
                }));
        
                text += `${key}:\n-----------------------------------\n`;
                for (const product of products) {
                    const { link, title, quantity, price, selectedKom } = product;
                    text += `[${title}](${link})\nКоличества: ${quantity}шт.\n${selectedKom ? `Комплектация: ${selectedKom.match(/title-([^\:]+)/)[1]}` : ''}\nЦена: ${Number((selectedKom ? selectedKom.match(/price-(\d+)/)[1] : price) * quantity).toLocaleString()} ₽\n-----------------------------------\n`;
                }
            } else {
                text += `${key}: ${val}\n`;
            }
        }
     
        text += `\n${req.socket.remoteAddress}`;
        text += `\n${new Date().toLocaleString()}`;
    
        const params = new URLSearchParams({
            chat_id: chatId,
            text: text,
            parse_mode: 'markdown'
        });

    
        const messageUrl = `https://api.telegram.org/bot${tgBotToken}/sendMessage?${params}`;
        const messageResponse = await fetch(messageUrl);
        console.log(messageUrl);
    
        res.status(200).json({ 'success': true });
    } catch (err) {
        res.status(500).json({ message: err });
    }
}
