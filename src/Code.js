let sheetName = '';
let emailSubject = 'New submission using FormEasy';
let formHeading = 'Form submission - FormEasy';
let email = '';
let fields = [];
let captcha = null;

/**
 * @param {String} name Name of the sheet to log the data
 */
function setSheet(name) {
  sheetName = name;
}

/**
 * @param {String} id Email ID to which message has to be sent
 */
function setEmail(id) {
  email = id;
}

/**
 * @param {String} subject Subject of the email
 */
function setSubject(subject) {
  emailSubject = subject;
}

/**
 * @param {String} heading Heading of the form
 */
function setFormHeading(heading) {
  formHeading = heading;
}

/**
 * @param {string} fieldsArr Fields in the contact form as string params
 */
function setFields(...fieldsArr) {
  fields = [...fieldsArr];

  const length = fields.length;

  let sheet;

  if (!sheetName) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  } else sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  const firstRow = sheet.getDataRange().getValues()[0];

  // Checking if columns in sheet and fields are matching
  if (firstRow.toString() !== '') {
    if (
      firstRow[0].toLowerCase() === fields[0].toLowerCase() &&
      firstRow[firstRow.length - 2].toString().toLowerCase() === fields[length - 1].toString().toLowerCase()
    ) {
      return;
    }
    if (firstRow.length > length + 1) sheet.getRange(1, 1, 1, 30).clearContent(); // Clearing upto 30 columns
  }

  const formatFirstLetter = (str) => str[0].toUpperCase() + str.slice(1);

  for (let idx = 0; idx < length; idx++) {
    sheet.getRange(1, idx + 1).setValue(formatFirstLetter(fields[idx]));
    if (idx === length - 1) {
      sheet.getRange(1, idx + 2).setValue('Date');
    }
  }
}

/**
 * Google reCAPTCHA V2 implementation
 *
 * @param {String} secretKey Private key of reCAPTCHA site
 */
function setRecaptcha(secretKey) {
  captcha = { type: 'recaptcha_v2', data: { secretKey } };
}

/**
 * @param {Object} req POST request object
 * @return {Object} response to the POST request
 */
function action(req) {
  let { postData: { contents, type } = {} } = req;
  let response = {};

  let jsonData;

  try {
    jsonData = JSON.parse(contents);
  } catch (err) {
    response = {
      status: 'error',
      message: 'Invalid JSON format',
    };
    return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
  }

  if (captcha) {
    switch (captcha.type) {
      case 'recaptcha_v2':
        const siteKey = jsonData['gCaptchaResponse'];

        if (!siteKey) {
          response = {
            status: 'error',
            message: "reCAPTCHA verification under key 'gCaptchaResponse' is required.",
          };
          return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
        }

        const captchaResponse = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'post',
          payload: {
            response: siteKey,
            secret: captcha.data.secretKey,
          },
        });

        const captchaJson = JSON.parse(captchaResponse.getContentText());

        if (!captchaJson.success) {
          response = {
            status: 'error',
            message: 'Please tick the box to verify you are not a robot.',
          };

          return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
        }

        break;
      default:
      // Captcha not enabled
    }
  }

  let logSheet;

  const allSheets = SpreadsheetApp.getActiveSpreadsheet()
    .getSheets()
    .map((s) => s.getName());

  if (sheetName) {
    const sheetExists = allSheets.includes(sheetName);
    if (!sheetExists) {
      response = {
        status: 'error',
        message: 'Invalid sheet name',
      };
      return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }
    logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  } else {
    logSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  }

  if (fields.length < 1) {
    setFields('name', 'email', 'message');
  }

  const length = fields.length;

  const lastRow = logSheet.getLastRow();

  const now = new Date();
  const date =
    now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) +
    ' ' +
    now.toLocaleTimeString('en-US');

  // Inserting a row after the first row
  logSheet.insertRowAfter(1);

  // Filling the latest data in the second row
  for (let idx = 0; idx < length; idx++) {
    logSheet.getRange(2, idx + 1).setValue(jsonData[fields[idx]]);
    if (idx === length - 1) {
      logSheet.getRange(2, idx + 2).setValue(date);
    }
  }

  const emailData = fields.reduce((a, c) => ({ ...a, [c]: jsonData[c] }), {});
  const htmlBody = HtmlService.createTemplateFromFile('EmailTemplate');
  htmlBody.data = emailData;
  htmlBody.formHeading = formHeading;

  const emailBody = htmlBody.evaluate().getContent();

  if (email) {
    MailApp.sendEmail({
      to: email,
      subject: emailSubject,
      htmlBody: emailBody,
      replyTo: jsonData.email,
    });
  }

  response = {
    status: 'OK',
    message: 'Data logged successfully',
  };

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}
