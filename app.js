const axios = require('axios')
const db = require('./db')
(async () => {
    try {
        let pagination_token = 'asd'
        while (pagination_token !== '') {
            const {data} = await axios.get('https://instagram-scraper-api2.p.rapidapi.com/v1/following', {
                params: {
                    username_or_id_or_url: 'adelclarabelle',
                    amount: '1000',
                    pagination_token: pagination_token === 'asd' ? undefined : pagination_token
                },
                headers: {
                    'X-RapidAPI-Key': '3407acfbbamshc157093ac0f6b55p1cb7b2jsn19b5a520b70a',
                    'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com'
                }
            })

            pagination_token = data.pagination_token
            const insertedData = []

            const {items} = data.data

            for (const {username} of items) {
                insertedData.push({
                    username,
                    type: "following"
                })
            }

            console.log('insertedData', insertedData)
            await db('ig_list')
                .insert(insertedData)
        }
        console.log('done')

        const list_of_follower = await db('ig_list')
            .where({
                type: 'follower'
            })
            .pluck('username')
            .distinct()

        const list_of_following = await db('ig_list')
            .where({
                type: 'following'
            })
            .pluck('username')
            .distinct()

        let notFollowBack = list_of_following.filter(user => !list_of_follower.includes(user));

        console.log('notFollowBack', notFollowBack);
    } catch (e) {
        console.log(e.response.data)
        console.log(e.config.params)
    }
})()