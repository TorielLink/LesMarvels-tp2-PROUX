import fetch from 'node-fetch'
import crypto from 'crypto'

/**
 * Récupère les données de l'endpoint en utilisant les identifiants
 * particuliers developer.marvels.com
 * @param url l'end-point
 * @return {Promise<json>}
 */
export const getData = async (url) => {
    const publicKey = '2fecc9c7fcfb0add141375f11f0421df'
    const privateKey = '0231e21fe4cccb3b16eb1d89facfe7be74142fb7'
    const timestamp = Date.now().toString()
    const hash = await getHash(publicKey, privateKey, timestamp)

    const fullUrl = `${url}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`

    try {
        const response = await fetch(fullUrl);

        if (!response.ok)
            throw new Error(`Erreur HTTP ! Status: ${response.status}`);

        const data = await response.json();
        const results = data.data.results

        return results
            .filter((character) => {
                const thumbnail = character.thumbnail;
                return (
                    thumbnail &&
                    !thumbnail.path.includes('image_not_available')
                );
            })
            .map((character) => {
                return {
                    name: character.name,
                    description: character?.description,
                    image: `${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}`,
                };
            });
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
}

/**
 * Calcul la valeur md5 dans l'ordre : timestamp+privateKey+publicKey
 * cf documentation developer.marvels.com
 * @param publicKey
 * @param privateKey
 * @param timestamp
 * @return {Promise<string>} en hexadecimal
 */
export const getHash = async (publicKey, privateKey, timestamp) => {
    const dataToHash = `${timestamp}${privateKey}${publicKey}`;

    return crypto.createHash('md5').update(dataToHash).digest('hex');
}