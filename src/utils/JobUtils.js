module.exports = {
  remainingDays({
    "total-hours": totalHour,
    "daily-hours": dailyHours,
    created_at,
  }) {
    // cálculo de tempo restante
    const remainingDays = totalHour / dailyHours.toFixed();
    // const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed();

    console.log(remainingDays);

    const createdDate = new Date(created_at);
    const dueDay = createdDate.getDate() + Number(remainingDays);
    const dueDateInMs = createdDate.setDate(dueDay);

    const timeDiffInMs = dueDateInMs - Date.now();
    // transformar milli em dias
    const dayInMs = 1000 * 60 * 60 * 24;
    const dayDiff = Math.floor(timeDiffInMs / dayInMs);

    //  restam x dias
    // console.log(dayDiff);

    return dayDiff;
  },
  caculateBudget: ({ "total-hours": totalHour }, valueHour) =>
    valueHour * totalHour,
};
