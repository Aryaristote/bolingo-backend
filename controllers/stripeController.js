const stripe = require('stripe')('sk_test_51NtTa5FuZXK9X16fGCciqkqqL1SHLja0c9F3jC02GLrKBKrikKD8dA7TVUi541ZmUHJeGvf6MvKlrCgHCDsWUKdD003EtgTf9T');
const StripePayment = require('../models/StripePayment');
const Instructor = require('../models/Instructor');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

//Paystack keys
const paystackApiKey = "sk_test_f12a43a3bc65a900549762857dbb12c91fe156db";

//Random Unique reference
const timestamp = Date.now();
const randomValue = Math.floor(Math.random() * 1000);
const uniqueReference = `${timestamp}-${randomValue}`;

const create = async (req, res) => {
    try {
        // const { formData } = req.body.formData;
        const { formData } = {
            id: selectedItem.id,
            cvc,
            name,
            number,
            amount,
            descrpt,
            exp_year,
            exp_month,
            bankDetails,
            selectedOption: selectedOption ? selectedOption.value : null,
        }
        // console.log(formData);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd',
            payment_method_types: ['card'],
            payment_method_data: {
              card: {
                number: formData.number,
                exp_month: formData.exp_month,
                exp_year: formData.exp_year,
                cvc: formData.cvc,
              },
            },
        });

        const newFormData = new FormData(formData);
        await newFormData.save();
        res.status(200).json({ success: true, paymentIntent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error making payment' });
    }
}

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025, // This is the default port used by MailDev
  ignoreTLS: true,
});

const read = async (req, res) => {
    try {
        const stripePayment = await StripePayment.findAll({
            include: [
                {
                    model: Instructor,
                    as: 'Instructor',
                },
            ],
        });
        return res.json({ stripePayment });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const payCash = async (req, res) => {
  try {
    const {
      instructorId,
      currency,
      number,
      amount,
      descrpt,
      optionValue,
    } = req.body;

    const existingUser = await Instructor.findOne({ where: { id: instructorId } });

    if (!existingUser) {
      return res.status(404).json({ error: 'Email not found for the specified instructorId' });
    }

    const email = existingUser.email;

    const mailOptions = {
      from: 'bolingoconsult@gmail.com',
      to: email,
      subject: 'Payment Confirmation',
      html: `
        <p>Bolingo | Kingura</p>
        <div>
          <p>This message is to confirm the transaction of the payment: <br> 
            Amount: ${amount} : ${currency} 
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    const cashPayment = await StripePayment.create({ instructorId, currency, number, amount, description: descrpt, type: optionValue });
    
    res.status(201).json({ message: 'Data inserted successfully', cashPayment });
    console.log("Data inserted and and mail sent");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Paystack Payment
const createPayment = async (req, res) => {
  try {
    const recipientData = {
      type: 'mobile_money',
      name: "Kalume Ernest Ary",
      description: "Description oh Hello",
      account_number: '0551234987',
      bank_code: 'MTN',
      currency: 'GHS',
    };

    const response = await axios.post('https://api.paystack.co/transferrecipient', recipientData, {
      headers: {
        Authorization: `Bearer ${paystackApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const recipientCode = response.data.data.recipient_code;
    console.log('Recipient created. Recipient Code:', recipientCode);
    console.log(response.data)
    // Use the recipient code in the transfer creation request
  } catch (error) { 
    console.error('Error initializing payment:', error);
    res.status(500).json({ error: 'An error occurred' });
  } 
};

module.exports = {
    read,
    create,
    payCash,
    createPayment
};