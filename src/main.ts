function changeTextContent(element: HTMLTitleElement | Element | null) {
  if (!element) return;

  element.textContent = import.meta.env.VITE_PROJECT_NAME;
}

// chatgpt generated regex
function isValidCreditCard(input: string | null): boolean {
  if (!input) return false;

  const cardNumberWithoutSpaces = input.replace(/\s/g, "");
  const cardRegex =
    /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(3[47][0-9]{13})|(6(?:011|5[0-9]{2})[0-9]{12})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/;

  return cardRegex.test(cardNumberWithoutSpaces);
}

function isValidMonth(input: string | null): boolean {
  if (!input) return false;

  const monthRegex = /^(0?[1-9]|1[0-2])$/;
  return monthRegex.test(input);
}

function isValidDigits(digits: number, input: string | null): boolean {
  if (!input) return false;

  const regex = new RegExp(`^[0-9]{${digits}}$`);
  return regex.test(input);
}

(function () {
  const title = document.querySelector("title");
  changeTextContent(title);

  const heading = document.querySelector(".sr-only");
  changeTextContent(heading);

  const form = document.querySelector("form");
  if (!form) return;

  const main = document.querySelector("main");
  if (!main) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    const { cardholderName, cardNumber, MM, YY, cvc } =
      Object.fromEntries(formData);

    let isValidated = false;

    cardholderName: {
      const input = document.querySelector<HTMLInputElement>(
        'input[name="cardholderName"]'
      );
      if (!input) return;

      const invalidSpan = input.nextElementSibling;
      if (!invalidSpan) return;

      if (!cardholderName) {
        input.setAttribute("required", "");
        invalidSpan.textContent = "Can't be blank";
        isValidated = false;
        break cardholderName;
      }

      const cardElement =
        document.querySelector<HTMLSpanElement>(".front__owner");
      if (!cardElement) return;

      cardElement.textContent = cardholderName.toString();
      isValidated = true;
    }

    cardNumber: {
      const input = document.querySelector<HTMLInputElement>(
        'input[name="cardNumber"]'
      );
      if (!input) return;

      const invalidSpan = input.nextElementSibling;
      if (!invalidSpan) return;

      if (!cardNumber) {
        input.setAttribute("required", "");
        invalidSpan.textContent = "Can't be blank";
        isValidated = false;

        break cardNumber;
      }

      if (!isValidCreditCard(input.value)) {
        input.classList.add("invalid");
        invalidSpan.textContent = "Wrong format, numbers only";
        isValidated = false;

        break cardNumber;
      }

      input.classList.remove("invalid");

      const cardElement =
        document.querySelector<HTMLSpanElement>(".front__number");
      if (!cardElement) return;

      cardElement.textContent = cardNumber.toString();
      isValidated = true;
    }

    expirationDate: {
      const mmInput =
        document.querySelector<HTMLInputElement>('input[name="MM"]');
      if (!mmInput) return;

      const yyInput =
        document.querySelector<HTMLInputElement>('input[name="YY"]');
      if (!yyInput) return;

      const invalidSpan = yyInput.nextElementSibling;
      if (!invalidSpan) return;

      if (!MM || !YY) {
        mmInput.setAttribute("required", "");
        yyInput.setAttribute("required", "");

        invalidSpan.textContent = "Can't be blank";
        isValidated = false;

        break expirationDate;
      }

      if (!isValidMonth(mmInput.value)) {
        mmInput.classList.add("invalid");
        invalidSpan.textContent = "Invalid input";
      } else {
        mmInput.classList.remove("invalid");
      }

      if (!isValidDigits(2, yyInput.value)) {
        yyInput.classList.add("invalid");
        invalidSpan.textContent = "Invalid input";
      } else {
        yyInput.classList.remove("invalid");
      }

      if (
        mmInput.classList.contains("invalid") ||
        yyInput.classList.contains("invalid")
      ) {
        isValidated = false;
        break expirationDate;
      }

      const cardElement =
        document.querySelector<HTMLSpanElement>(".front__date");
      if (!cardElement) return;

      cardElement.textContent = `${MM}/${YY}`;
      isValidated = true;
    }

    cvc: {
      const input =
        document.querySelector<HTMLInputElement>('input[name="cvc"]');
      if (!input) return;

      const invalidSpan = input.nextElementSibling;
      if (!invalidSpan) return;

      if (!cvc) {
        input.setAttribute("required", "");
        invalidSpan.textContent = "Can't be blank";
        isValidated = false;
        break cvc;
      }

      if (!isValidDigits(3, input.value)) {
        input.classList.add("invalid");
        invalidSpan.textContent = "Invalid input";
        isValidated = false;
        break cvc;
      }

      input.classList.remove("invalid");

      const cardElement =
        document.querySelector<HTMLSpanElement>(".back__number");
      if (!cardElement) return;

      cardElement.textContent = cvc.toString();
      isValidated = true;
    }

    if (!isValidated) return;

    main.classList.add("post");
  });

  const postButton = document.querySelector(".container--post button");
  if (!postButton) return;

  postButton.addEventListener("click", () => {
    main.classList.remove("post");
  });
})();
