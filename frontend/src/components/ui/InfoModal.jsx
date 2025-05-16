import React, { useEffect } from 'react';

const InfoModal = ({ isOpen, onClose, language }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (event.target.classList.contains('modal-backdrop')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="border-b p-4 flex justify-between items-center">
          <h5 className="text-xl font-bold">
            {language === "GE" ? "როგორ მუშაობს ხელფასების კალკულატორი" : "How Does the Salary Calculator Work"}
          </h5>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {language === "GE" ? (
            <>
              <p>ხელფასების კალკულატორიის მეშვეობით სტატისტიკური ინფორმაციის მომხმარებელს შეუძლია თავის მიერ წინასწარ მითითებული პირობის შესაბამისად გაიანგარიშოს საშუალო ნომინალურ ხელფასი საქართველოში. აღნიშნული მონაცემები ხელმისაწვდომია ქვეყნის, რეგიონის, ეკონომიკური საქმიანობის სახეებისა და სქესის მიხედვით.</p>
              <p className="font-bold mt-4">მონაცემის მისაღებად განსახორციელებელი ეტაპები</p>
              <p className="font-bold mt-4">1. პირველი ეტაპი - აირჩიეთ დროითი პერიოდი</p>
              <p>აირჩიეთ წელი, რა პერიოდშიც გსურთ საშუალო ნომინალური ხელფასის გაანგარიშება. წლის არჩევა შესაძლებელია ქვემოთ, ოდნავ მარცხნივ მდებარე რკალიდან, სადაც მითითებულია "აირჩიეთ წელი".</p>
              <p className="font-bold mt-4">2. შემდგომი ეტაპი - რეგიონის არჩევა</p>
              <p>აირჩიეთ თქვენთვის საინტერესო რეგიონი ზემოთ, ოდნავ მარცხნივ მდებარე საქართველოს რუკიდან, რომლის ფარგლებშიც გსურთ საშუალო ნომინალურ ხელფასის გაანგარიშება.</p>
              <p className="font-bold mt-4">3. მონაცემები ეკონომიკური სამქიანობის სახეების მიხედვით</p>
              <p>ხელფასების კალკულატორი საშუალებას იძლევა, სტატისტიკური ინფორმაციის მომხმარებელმა გაიანგარიშოს საშუალო ნომინალური ხელფასი ეკონომიკური სამიანობის სახეების მიხედვით. ამისთვის საჭიროა მარჯვნივ არსებული ეკონომიკური საქმიანობის სექციებიდან (შედგენილია ეკონომიკურ საქმიანობათა სახეების ეროვნული კლასიფიკატორის NACE Rev.2-ის შესაბამისად) აირჩიოს მისთვის საინტერესო ეკონომიკური საქმიანობის სახე.</p>
              <p className="font-bold mt-4">4. მონაცემები სქესის მიხედვით</p>
              <p>ხელფასების კალკულატორი საშუალებას იძლევა, სტატისტიკური ინფორმაციის მომხმარებელმა გაიანგარიშოს საშუალო ნომინალური ხელფასი სქესის მიხედვით. ამისთვის საჭიროა მან აირჩიოს ქვემოთ მოცემულული შესაბამისი სქესი, რომლის ფარგლებშიც მას სურს საშუალო ნომინალური ხელფასის გაანგარიშება.</p>
              <p className="font-bold mt-4">5. დამატებითი ინფორმაცია</p>
              <p>ხელფასების კალკულატორის მეშვეობით სტატისტიკური ინფორმაციის მომხმარებელს შეუძლია განახორციელოს რამდენიმე საფეხურიანი კომბინიაცია, კერძოდ ერთდროულად აირჩიოს მისთვის საინტერესო წელი, რეგიონი, ეკონომიკური საქმიანობის სახე და სქესი საშუალო ნომინალური ხელფასის გასაანგარიშებლად.</p>
              <p className="font-bold mt-4">6. ხელფასები პროფესიების მიხედვით</p>
              <p>პროფესიების მიხედვით ხელფასების კალკულაცია შესაძლებელია ზემოთ მარჯვენა მხარეს მდებარე ბმულიდან "ხელფასები პროფესიების მიხედვით". ამის შემდეგ მომხმარებელმა გრაფიდან უნდა აირჩიოს მისთვის საინტერესო პროფესიული ჯგუფი. მონაცემები ხელმისაწვდომია სქესის მიხედვით. პროფესიები წარმოდგენილია დასაქმების სტანდარტული კლასიფიკატორის - ISCO-ს მიხედვით.</p>
              <p className="font-bold mt-4">
                7. დეტალური ინფორმაცია ხელფასების სტატისტიკის შესახებ ხელმისაწვდომია{' '}
                <a href="http://geostat.ge/?action=page&p_id=148&lang=geo" className="text-blue-600 hover:text-blue-800">
                  აქ
                </a>
              </p>
            </>
          ) : (
            // English version - you can add the English translation here
            <p>English version of the help text will go here...</p>
          )}
        </div>
        <div className="border-t p-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            onClick={() => window.print()}
          >
            {language === "GE" ? "ბეჭდვა" : "Print"}
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            {language === "GE" ? "დახურვა" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
