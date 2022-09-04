import dotenv from 'dotenv';
import { parse, isWithinInterval } from 'date-fns';
import nodemailer from 'nodemailer';

dotenv.config();

const checkAvailability = async () => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.me.com',
    port: 587,
    auth: {
      user: 'ugo.romi@icloud.com',
      pass: process.env.APP_PASSWORD,
    },
  });
  const from = new Date(2022, 10, 10)

  const to = new Date(2022, 10, 15);

  const url = `https://ticket.toureiffel.paris/get-calendar-by-month?year=2022&month=10`;
  console.log(`calling ${url}`);
  const body = await (await fetch(url)).json();
  const availableDays = body.Available.map((d) => parse(d, 'yyyy,MM,dd', new Date()));
	const datesInInterval = availableDays.filter((d) => isWithinInterval(d, { start: from, end: to }))
  console.log(`Found ${datesInInterval.length} available days`);

  if (datesInInterval.length > 0) {
    let emailSubject = '';
    for (const availableDay of datesInInterval) {
      emailSubject += `${new Date(availableDay.Date).toLocaleDateString(
        'it-IT'
      )} `;
    }
    transporter.sendMail({
      from: 'ugo.romi@icloud.com',
      to: 'ugo.romi@icloud.com',
      subject: `POSTI DISPONIBILI PRESSO TOUR EIFFEL IL/I GIORNO/I ${emailSubject}`,
      text: 'per prenotare vai su https://ticket.toureiffel.paris/en',
      html: '<p>per prenotare vai su <a href="https://ticket.toureiffel.paris/en">https://ticket.toureiffel.paris/en</a></p>',
    });
  }

  transporter.close();
	console.log("done")
};

checkAvailability();