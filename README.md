<h1 align="center">FormEasy</h1>

<p align="center">
  <a href="https://github.com/Basharath/FormEasy/blob/master/LICENSE" target="blank">
    <img src="https://img.shields.io/github/license/Basharath/FormEasy" alt="FormEasy licence" />
  </a>
  <a href="https://github.com/Basharath/FormEasy/fork" target="blank">
    <img src="https://img.shields.io/github/forks/Basharath/FormEasy" alt="FormEasy forks"/>
  </a>
  <a href="https://github.com/Basharath/FormEasy/stargazers" target="blank">
    <img src="https://img.shields.io/github/stars/Basharath/FormEasy" alt="FormEasy stars"/>
  </a>
  <a href="https://github.com/Basharath/FormEasy/issues" target="blank">
    <img src="https://img.shields.io/github/issues/Basharath/FormEasy" alt="FormEasy issues"/>
  </a>
  <a href="https://github.com/Basharath/FormEasy/pulls" target="blank">
    <img src="https://img.shields.io/github/issues-pr/Basharath/FormEasy" alt="FormEasy pull-requests"/>
  </a>
</p>

FormEasy is a free and open source apps script library that lets you receive forms from your static sites very easily.

Script ID: `1CAyzGbXdwMlko81SbJAjRp7ewxhyGKhDipDK4v8ZvlpYqrMAAzbFNccL`

## Adding FormEasy library to Apps Script

1. Open a new Google sheets file(this is where your form data gets stored)
2. From the menu bar click Extensions > Apps Script and it opens up a new apps script file
3. In the left bar of apps script file click `+` button beside `Libraries`
4. Add the `Script ID` listed above and click `Look up` button and select the latest version. Note the identifier it is going to be used to invoke the functions in the library and finally click `Add` button.

Now you can use `FormEasy` object inside the apps script file.

## Usage

Clear the default function if any in the apps script file and add the below function.

**Simplest case**

```js
function doPost(req) {
  FormEasy.setEmail('youremail@domain.com'); // To receive email notification(optional)
  return FormEasy.action(req); // Mandatory to return action method
}
```

The default data fields are: name, email and message. To add more, use `setFields` method as shown below.

**With more customizations**

```js
function doPost(req) {
  FormEasy.setSheet('Sheet1'); // Optional
  FormEasy.setEmail('youremail@domain.com'); // To receive email notification(optional)
  FormEasy.setSubject('Email subject'); // Optional
  FormEasy.setFormHeading('Form heading inside email'); // Optional
  FormEasy.setFields('name', 'email', 'website', 'message', ...); // Optional(name, email, messsage are default)
  return FormEasy.action(req); // It should be at the end and return it
}
```

After adding the above function click the `Deploy` button at top right corner and select **New deployment** and select type to `Web app` from the gear icon.

Select/fill the below options

- Description(optional),
- Execute as `Me(you email)`
- Who has access `Anyone`

Click `Deploy` button(authorize the script if you haven't done before) and you will get a URL under `Web app`, copy that and it is going to be the end point for submitting the POST request.

Note: You need not make _New deployment_ everytime if you want to use the same web app URL. Select **Manage deployments** and update the version to keep the same URL.

## Form submission using `fetch`

```js
const data = {
  name: 'John',
  email: 'john@domain.com',
  message: 'Receiving forms is easy and simple now!',
};

const url = 'https://script.google.com/macros/s/<Deployment ID>/exec';

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain;charset=utf-8',
  },
  body: JSON.stringify(data),
})
  .then((res) => res.json())
  .then((data) => console.log('data', data))
  .catch((err) => console.log('err', err));
```

Note: The keys of the `data` object should match with the fields that are set using `setFields` method in the apps script file. The default keys are `name`, `email` and `message`.

Article: https://devapt.com/formspree-alternative-formeasy

## Captcha validation

FormEasy supports multiple captcha providers to allow you to prevent unverified submissions by robots. Each provider is unique and requires a unique configuration. Please refer to the documentation below to enable a specific captcha provider.

### Google reCAPTCHA V2

1. Register a site and get your secret key, and site key: [https://www.google.com/recaptcha/admin/create](https://www.google.com/recaptcha/admin/create)

2. In your apps script file, inside function `doPost`, add the following configuration:

```js
function doPost(req) {
  // ...
  FormEasy.setRecaptcha('YOUR_SECRET_KEY'); // To validate reCAPTCHA
  // ...
  return FormEasy.action(req); // Mandatory to return action method
}
```

3. On your website, add the reCAPTCHA library at the end of the `<head>` tag:

```html
<head>
  <!-- ... -->

  <script src="https://www.google.com/recaptcha/api.js" async defer></script>
</head>
```

4. Add reCAPTCHA input into your form:

```html
<div class="g-recaptcha" data-sitekey="YOUR_SITE_KEY"></div>
```

5. You should see `I am not a robot` box on your site. If you don't, please refer to [reCAPTCHA Docs](https://developers.google.com/recaptcha/docs/display) for debugging.

6. Inside your `fetch()` method, add a reCAPTCHA response from the input:

```js
const data = {
  // ...
  gCaptchaResponse: document.getElementById('g-recaptcha-response').value,
};

// ...
```

### Google reCAPTCHA V3

Steps 1 & 2 same as above.

3. On your website, add the reCAPTCHA library at the end of the `<head>` tag:

```html
<head>
  <!-- ... -->

  <script src="https://www.google.com/recaptcha/api.js?render=<YOUR_SITE_KEY>" async defer></script>
</head>
```

4. Read the form data, reCAPTCHA V3 response token and send the request.

```js
const siteKey = '<YOUR_SITE_KEY>';

const url = 'https://script.google.com/macros/s/<Deployment ID>/exec';

function handleSubmit(event) {
  event.preventDefault();

  // Make an API call to get the reCAPTCHA token
  grecaptcha.ready(function () {
    grecaptcha.execute(siteKey, { action: 'submit' }).then(function (token) {
      // Add the reCAPTCHA token to the form data
      data.gCaptchaResponse = token;
      data.name = document.getElementById('name').value;
      data.website = document.getElementById('website').value;
      data.email = document.getElementById('email').value;
      data.message = document.getElementById('message').value;

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => console.log('data', data))
        .catch((err) => console.log('err', err));
    });
  });
}

document.getElementById('<YOUR_FORM_ID>').addEventListener('submit', handleSubmit);
```

## Video instructions

To see all the above instructions step by step, check this quick [demo video](https://www.youtube.com/watch?v=0u75mtnhifM/).

## FAQs

<details>
  <summary>1. Is it safe to grant permission to the apps script file while using FormEasy library?
  </summary>
  Yes, it is completely safe.

FormEasy code doesn't interact with any remote servers. You can check the source code of the FormEasy library using its ScriptID.

Google shows it unsafe because it hasn't verified the script. Even if you write your own script and grant permission the same message will be shown.

</details>

<details>
  <summary>2. Can I customize FormEasy script?
  </summary>
  
  Yes. You're free to customize any part of the FormEasy script and deploy on your own to reflect the same.

If you want even others to use your customizations then you can contribute your code and once verified it will be pushed to the main script. You can check [contributing guidelines](https://github.com/Basharath/FormEasy/blob/master/CONTRIBUTING.md).

</details>

<details>
  <summary>3. What are the limitations of FormEasy?
  </summary>
  
  There are no specific limitations for FormEasy library.

But Google Apps Script limits the email to 100/day and script run time to 6min/execution. You can see more about those [here](https://developers.google.com/apps-script/guides/services/quotas)

</details>

## License

FormEasy is distributed using the MIT License. Check the [License details](https://github.com/Basharath/FormEasy/blob/master/LICENSE).
