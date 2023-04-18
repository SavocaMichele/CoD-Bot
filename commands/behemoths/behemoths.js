const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('behemoth')
        .setDescription('Sends Information of the given behemoth')
        .addStringOption(option =>
            option.setName('behemoth')
                .setDescription('The Name of the Behemoth')
                .setRequired(true)
                .addChoices(
                    { name: 'Giant Bear', value: 'Giant Bear' },
                    { name: 'Giant', value: 'Giant' },
                    { name: 'Thunder Roc', value: 'Thunder Roc' },
                    { name: 'Hydra', value: 'Hydra' },
                    { name: 'Direbear', value: 'Direbear' },
                    { name: 'Magma Devourer', value: 'Magma Devourer' },
                    { name: 'Necrogiant', value: 'Necrogiant' },
                    { name: 'Flame Dragon', value: 'Flame Dragon' },
                )),

    async execute(interaction) {
        const behemoth = interaction.options.getString('behemoth');
        const data = await behemoths(behemoth);

        await interaction.reply({embeds: [data]});
    },
};


async function behemoths(behemoth) {

    this.result = '';

    const response = await fetch('https://onestop.63cj.com/api/samo_2/roles');
    const result   = await response.json();

    if (result) {

        for (let i = 0; result.data.length > i; i++) {

            if (result.data[i].name.value === behemoth) {
                this.result = generateEmbed(result.data[i]);
            }

        }

    }

    return this.result;
}

function generateEmbed(data) {

    let color = '#d18a27';

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
            {name: '> ' + data.skill[4].name.value || '', value: data.skill[4].desc.value || ''},
            {name: '> ' + data.skill[5].name.value || '', value: data.skill[5].desc.value || ''},
            {name: '> ' + data.skill[6].name.value || '', value: data.skill[6].desc.value || ''},
            {name: '> ' + data.skill[7].name.value || '', value: data.skill[7].desc.value || ''},
            {name: '> ' + data.skill[8].name.value || '', value: data.skill[8].desc.value || ''},
        )
        .setTimestamp()
        .setFooter({text: 'Data provided by ESR Family ❤️',});

    return exampleEmbed;

}