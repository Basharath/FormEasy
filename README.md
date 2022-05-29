# FormEasy

FormEasy is a free and open source apps script library that lets you receive forms from your static sites without writing any code.

Script ID: `1Q5-rRsocVEjTjgDHvkhWrqO2nURPh4JtQ4yZTbroWnF-iSO8z-CAhgdJ`

## Adding FormEasy library to Apps Script

1. Open a new Google sheets file(this is where your form data gets stored)
2. From the menu bar click Extensions > Apps Script and it opens up a new apps script file
3. In the left bar of apps script file click `+` icon beside `Libraries`
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

Select the below options

- Description(optional),
- Execute as `Me(you email)`
- Who has access `Anyone`

Click `Deploy` button and you will get a URL under `Web app`, copy that and it is going to be the end point for submitting the POST request.

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
