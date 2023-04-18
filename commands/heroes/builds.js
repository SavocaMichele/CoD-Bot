const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('build')
        .setDescription('Sends Talent-Tree Builds of the given hero')
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
        const data = await builds(hero);

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


async function builds(hero) {

    const heroData    = await heroes(hero);
    const figureMatch = /<figure[^>](.*?)<\/figure>/g;
    const imageMatch  = /https?:[^)''"]+\.(?:jpg|jpeg|gif|png)/g;
    let images        = [];
    let embeds        = [];

    const response = await fetch(`https://callofdragonsguides.com/${hero.toLowerCase()}-talent-tree-build-and-guide/`);
    let result     = await response.text();

    if (!result) {
        return 'Error';
    }

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

    const matches = result.matchAll(figureMatch)

    for (const match of matches) {
        images.push(match[0].match(imageMatch));
    }

    if (images.length === 0) {
        return 'Error';
    }

    for (let i = 0; images.length > i; i++) {

        let exampleEmbed = new EmbedBuilder()
            .setURL(`https://callofdragonsguides.com/${hero.toLowerCase()}-talent-tree-build-and-guide/`)
            .setColor(color)
            .setTitle(heroData.name.value)
            .setDescription(`The ${heroData.name.value} Talent-Tree Guide is being provided by callofdragonsguides.com. These guides may not always be up to date!`)
            .setThumbnail(heroData.imgpc.value)
            .setImage(images[i][0] || '')
            .setTimestamp()
            .setFooter({text: 'Data provided by ESR Family ❤️',});

        embeds.push(exampleEmbed);
    }

    return embeds;
}