const tgBotToken = process.env.NEXT_PUBLIC_TG_BOT_TOKEN;
const chatId = process.env.NEXT_PUBLIC_CHAT_ID;

export default async function handler(req, res) {
    try{
        let text = 'Заявка от дизайнера\n';
    
        for (const [key, val] of Object.entries(req.body)) {
            text += `${key}: ${val}\n`;
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
