import Fastify from 'fastify';
import pointOfView from '@fastify/view';
import handlebars from 'handlebars';
import { getData } from './api.js';

const fastify = Fastify({ logger: true });

fastify.register(pointOfView, {
    engine: {
        handlebars,
    },
    root: './templates',
    options: {
        partials: {
            header: 'header.hbs',
            footer: 'footer.hbs',
        },
    },
});

fastify.get('/', async (request, reply) => {
    try {
        const endpoint = 'https://gateway.marvel.com/v1/public/characters';
        const characters = await getData(endpoint);

        return reply.view('index.hbs', { characters });
    } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send('Erreur lors de la récupération des personnages.');
    }
});

const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        console.log('Serveur démarré sur http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
console.log("Je suis Marvel")