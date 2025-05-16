import React, { useEffect } from 'react';

const InfoModal = ({ isOpen, onClose, language }) => {
  const handlePrint = () => {
    const printContent = document.getElementById('modal-content').innerHTML;
    const originalBody = document.body.innerHTML;
    
    // Add print styles
    const printStyles = `
      <style>
        @media print {
          body * {
            visibility: hidden;
          }
          #print-content, #print-content * {
            visibility: visible;
          }
          #print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          #print-content button {
            display: none;
          }
        }
      </style>
    `;

    // Create print-specific content
    document.body.innerHTML = `
      ${printStyles}
      <div id="print-content">
        ${printContent}
      </div>
    `;

    window.print();
    document.body.innerHTML = originalBody;

    // Reattach event handlers after restoring content
    const modal = document.querySelector('.modal-backdrop');
    if (modal) {
      modal.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal-backdrop')) {
          onClose();
        }
      });
    }
  };

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
        <div id="modal-content">
          <div className="border-b p-4 flex justify-between items-center">
            <h5 className="text-xl font-bold">
              {language === "GE" ? "როგორ მუშაობს ხელფასების კალკულატორი" : "How Does the Salary Calculator Work"}
            </h5>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl print:hidden"
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
              <>
                <p>Statistical data stakeholder can use salary calculator for calculation average nominal salary in Georgia according to the predetermined conditions. These data are available by country, by region, by type of economic activity and by gender level.</p>
                <p className="font-bold mt-4">Stages to calculate data</p>
                <p className="font-bold mt-4">1. First step - select the period</p>
                <p>Select the year, you have interest to calculate average nominal salary. You can select the year from the left of the arc, indicating "Select Year".</p>
                <p className="font-bold mt-4">2. Second step - select region</p>
                <p>Click and select the region you have interested from the average nominal salary calculation from the map of Georgia located above</p>
                <p className="font-bold mt-4">3. Data by type of economic activity</p>
                <p>Salary calculator allows the stakeholder to calculate the average nominal salary according to the types of economic activity. It is necessary to select from the provided economic activities (according to NACE Rev.2) of the right the relevant type of economic activities.</p>
                <p className="font-bold mt-4">4. Data by gender</p>
                <p>salary calculator can be used by statistical data stakeholder in order to calculate the average nominal salary by gender. It is necessary to click relevant gender icon provided bellow.</p>
                <p className="font-bold mt-4">5. Additional information</p>
                <p>The statistical data stakeholder can make multiple step combination using salary calculator. For example it is possible at same time to select region, type of economic activity and gender in order to calculate average nominal salary.</p>
                <p className="font-bold mt-4">6. Salaries by professions</p>
                <p>It is possible to calculate salaries by profession using link provided right above "Salaries by professions". the stakeholder should have select the relevant profession from the appeared small window. The data available by gender. The professions are provided accordance with International Standard Classification of Occupation - ISCO.</p>
                <p className="font-bold mt-4">
                  7. Detailed information on salary statistics is available{' '}
                  <a href="http://geostat.ge/index.php?action=page&p_id=149&lang=eng" className="text-blue-600 hover:text-blue-800">
                    here
                  </a>
                </p>
              </>
            )}
          </div>
          <div className="border-t p-4 flex justify-end gap-2 print:hidden">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              onClick={handlePrint}
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
    </div>
  );
};

export default InfoModal;
