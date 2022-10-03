const Helper = {
  asyncMap: async function (array, callback){
    let results = [];
    for (let index = 0; index < array.length; index++) {
      const result = await callback(array[index], index, array);
      results.push(result);
    }
    return results;
  },
  formattedDate: function(date){
    var data = new Date(date),
        day  = data.getDate().toString(),
        dayF = (day.length == 1) ? '0'+day : day,
        month  = (data.getMonth()+1).toString(),
        monthF = (month.length == 1) ? '0'+month : month,
        yearF = data.getFullYear();
    return yearF+"-"+monthF+"-"+dayF + "T00:00:00";
  }
}

export const asyncMap = Helper.asyncMap
export const formattedDate = Helper.formattedDate
