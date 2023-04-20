const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pairs')
        .setDescription('Sends Pairing-Info of the given hero')
        .addStringOption(option =>
            option.setName('hero')
                .setDescription('The Name of the Hero')
                .setRequired(true)
                .addChoices(
                    { name: 'Waldyr', value: 'WALDYR' },
                    { name: 'Kella', value: 'KELLA' },
                    { name: 'Alistair', value: 'ALISTAIR' },
                    { name: 'Atheus', value: 'ATHEUS' },
                    { name: 'Nika', value: 'NIKA' },
                    { name: 'Madeline', value: 'MADELINE' },
                    { name: 'Eliana', value: 'ELIANA' },
                    { name: 'Liliya', value: 'LILIYA' },
                    { name: 'Nico', value: 'Nico' },
                    { name: 'Theia', value: 'Theia' },

                    { name: 'Gwanwyn', value: 'GWANWYN' },
                    { name: 'Alwyn', value: 'ALWYN' },
                    { name: 'Emrys', value: 'EMRYS' },
                    { name: 'Garwood', value: 'GARWOOD' },
                    { name: 'Indis', value: 'INDIS' },
                    { name: 'Velyn', value: 'Velyn' },

                    { name: 'Chakcha', value: 'CHAKCHA' },
                    { name: 'Ordo', value: 'ORDO' },
                    { name: 'Bakshi', value: 'BAKSHI' },
                    { name: 'Kregg', value: 'KREGG' },
                    { name: 'Bakhar', value: 'BAKHAR' },
                    { name: 'Hosk', value: 'HOSK' },
                    { name: 'Pan', value: 'Pan' },
                    { name: 'Kinnara', value: 'Kinnara' },
                )),

    async execute(interaction) {
        const hero = interaction.options.getString('hero');
        let data   = await pairs(hero);

        if (data === 'Error') {
            await interaction.reply("No data available.");
        } else {
            await interaction.reply({embeds: data});
        }

    },
};

async function heroes(hero) {

    this.result = '';

    const response = await fetch('https://onestop.63cj.com/api/samo_2/roles');
    const result   = await response.json();

    if (result) {

        for (let i = 0; result.data.length > i; i++) {

            if (result.data[i].name.value === hero) {
                this.result = result.data[i];
            }

        }

    }

    return this.result;
}


async function pairs(hero) {

    let data    = [];
    data        = await makeFetch(hero);


    if (data.length === 0) {
        data = await makeFetch(hero, `https://callofdragonsguides.com/${hero.toLowerCase()}-talent-tree-build-guide/`)
    }

    if (data.length === 0) {
        return 'Error';
    }

    return buildEmbed(hero, data);
}


async function makeFetch(hero, url) {

    const titleMatch    = /<h3 class="wp-block-heading"><span id="[^>]*>(.*?)<\/span><\/h3>/g;
    const contentMatch  = /<h3 class="wp-block-heading"><span id="[^>]*>.*?<\/span><\/h3>\n{0,10}<p>(.*?)<\/p>/g;
    const specialMatch  = /<h2 class="wp-block-heading"><span id=".*?Pairings[^>]*>.*?<\/span><\/h2>\n{1,10}<p>(.*?)<\/p>\n{1,10}<p>(.*?)<\/p>/g
    let response        = await fetch(`https://callofdragonsguides.com/${hero.toLowerCase()}-talent-tree-build-and-guide/`);
    let titles          = [];
    let contents        = [];
    let data            = [];

    if (url) {
        response        = await fetch(url)
    }

    let result          = await response.text();


    if (result) {
        const titleMatches = result.matchAll(titleMatch)
        for (const match of titleMatches) {
            titles.push(match[1]);
        }

        let contentMatches = result.matchAll(contentMatch)
        for (const match of contentMatches) {
            contents.push(match[1].replace(/(<a[^>]*>)/g, '').replace('</a>', '').replace('&nbsp;', ''));
        }
    }

    if (contents.length === 0 && titles.length === 0) {
        let specialMatches = result.matchAll(specialMatch);
        for (const match of specialMatches) {
            data[0] = [];
            data[0]['name'] = '...';
            data[0]['desc'] = match[1].replace(/(<a[^>]*>)/g, '').replace('</a>', '').replace('&nbsp;', '') + '\u200B' + match[2].replace(/(<a[^>]*>)/g, '').replace('</a>', '').replace('&nbsp;', '');
        }
    }

    if ((titles.length > 0 && contents.length > 0) && titles.length === contents.length) {
        for (let i = 0; titles.length > i; i++) {
            data[i]         = [];
            data[i]['name'] = titles[i];
            data[i]['desc'] = contents[i];
        }
    }


    return data;
}


async function buildEmbed(hero, pairs) {

    const heroData    = await heroes(hero);
    let embeds        = [];


    let color = '#288ccf';
    switch (heroData.camp.value) {
        case '阵营1':
            color = '#288ccf';
            break;
        case '阵营2':
            color = '#499a5d';
            break;
        case '阵营3':
            color = '#c43331';
            break;
    }


    for (let i = 0; pairs.length > i; i++) {

        let exampleEmbed = new EmbedBuilder()
            .setColor(color)
            .setTitle(`${heroData.name.value} & ${pairs[i]['name']}`)
            .setDescription(`The ${heroData.name.value} pairings are being provided by callofdragonsguides.com. These pairings may not always be up to date!`)
            .setThumbnail(heroData.imgpc.value)
            .addFields({name: ' ', value: pairs[i]['desc'] || ''})
            .setTimestamp()
            .setFooter({text: 'Data provided by ESR Family ❤️',});

        embeds.push(exampleEmbed);
    }

    return embeds;

}