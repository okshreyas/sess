// scripts.js
function getBorderClass(interaction, leadinteraction) {
     if (interaction === 'yes' && leadinteraction === 'yes') {
         return 'interaction-yes';
     } else if (interaction === 'yes' && leadinteraction === 'no') {
         return 'interaction-yes-lead-no';
     } else if (interaction === 'no' || leadinteraction === 'no') {
         return 'interaction-no';
     } else {
         return 'interaction-none';
     }
 }
 