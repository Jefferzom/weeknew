const connection = require('../database/connection');

module.exports = {
    async index(req,res) {
        const {page = 1} = req.query

        const [count] = await connection('incidents').count(); // Criando o contador !

        console.log(count);

        const incidents = await connection('incidents')
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
        .limit(5)
        .offset((page - 1) * 5)  // Esquema de paginação de 5 em 5!
        .select([
            'incidents.*', 
            'ongs.name', 
            'ongs.email', 
            'ongs.whatsapp', 
            'ongs.city', 
            'ongs.uf'
        ]); // Entrelaçando todos os dados da tabela 

        res.header('X-Total-Count', count['count(*)']); // Retornando o total de pags no cabeçalho
    
        return res.json(incidents);

    },

    async create(req, res) {
        const { title, description, value } = req.body;
        const ong_id = req.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });

        return res.json({ id });
    },

    async delete(req,res) {
        const { id } = req.params; // pegando id da ONG nos parametros
        const ong_id = req.headers.authorization; // pegando o id da ong autorizada!

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if (incident.ong_id =! ong_id) {
            return res.status(401).json({ error: 'Operation not permitted.' });
        }    

        await connection('incidents').where('id', id).delete();

        return res.status(204).send();
    }
};