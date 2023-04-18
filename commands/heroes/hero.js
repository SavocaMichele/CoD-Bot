const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hero')
        .setDescription('Sends Information of the given hero')
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
        const data = await heroes(hero);

        await interaction.reply({embeds: [data]});
    },
};


async function heroes(hero) {

    this.result = '';

    const response = await fetch('https://onestop.63cj.com/api/samo_2/roles');
    const result   = await response.json();

    if (result) {

        for (let i = 0; result.data.length > i; i++) {

            if (result.data[i].name.value === hero) {
                this.result = generateEmbed(result.data[i]);
            }

        }

    }

    return this.result;
}

function generateEmbed(data) {

    let color = '#288ccf';
    switch (data.camp.value) {
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

    const exampleEmbed = new EmbedBuilder()
        .setColor(color)
        .setTitle(data.name.value || '')
        .setDescription(data.introduce.value || '')
        .setThumbnail(data.imgpc.value || '')
        .addFields(
            {name: '> ' + data.skill[0].name.value || '', value: data.skill[0].desc.value || ''},
            {name: '> ' + data.skill[1].name.value || '', value: data.skill[1].desc.value || ''},
            {name: '> ' + data.skill[2].name.value || '', value: data.skill[2].desc.value || ''},
            {name: '> ' + data.skill[3].name.value || '', value: data.skill[3].desc.value || ''},
        )
        .setImage(data.property.value || '')
        .setTimestamp()
        .setFooter({text: 'Data provided by ESR Family ❤️',});

    return exampleEmbed;

}