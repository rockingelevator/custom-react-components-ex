export const convertToOptionsList = function(input, inverse=false) {
    if(!input) return null;
    let output = [];
    input.map(item => {
        if(!inverse){
            output.push({
                label: item.name,
                value: item
            })
        } else {
            output.push(Number.isInteger(item.value) ? {id: item.value, name: item.label} : item.value);
        }
    });
    return output;
};