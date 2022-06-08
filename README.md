<h1 align="center">FormEasy</h1>

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


## Video instructions
To see all the above instructions lively, check this demo video below.
<p align="center">
  <a href="https://www.youtube.com/watch?v=0u75mtnhifM/">
    <img alt="FormEasy video demo" src="https://img.youtube.com/vi/0u75mtnhifM/0.jpg" width="510" height="280"  />
  </a>
</p>

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
