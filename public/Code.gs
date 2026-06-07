/**
 * 619 FITNESS STUDIO MARATHON 2026 — Google Sheets Response Collector
 * 
 * HOW TO DEPLOY:
 * 1. Open your spreadsheet: https://docs.google.com/spreadsheets/d/1QAj78DadSNr17xRbmkAtnFGdqLxXDM_VkHlplOsRUWI/edit
 * 2. Go to Extensions > Apps Script
 * 3. Paste this entire file (Code.gs) into the editor, replacing any default code
 * 4. Click Deploy > New Deployment
 * 5. Choose type: Web App
 * 6. Execute as: Me
 * 7. Who has access: Anyone
 * 8. Click Deploy, then copy the Web App URL
 * 9. Paste that URL into marathon-registration.html (the SCRIPT_URL constant)
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById('1QAj78DadSNr17xRbmkAtnFGdqLxXDM_VkHlplOsRUWI').getSheetByName('Responses');
    
    const row = [
      new Date(),                                                        // A: Timestamp
      data.fullName || '',                                                // B: Full Name
      data.gender || '',                                                  // C: Gender
      data.dob || '',                                                     // D: Date of Birth
      data.age || '',                                                     // E: Age
      data.mobile || '',                                                  // F: Mobile Number
      data.whatsapp || '',                                                // G: WhatsApp Number
      data.email || '',                                                   // H: Email Address
      data.city || '',                                                    // I: City / Area
      data.occupation || '',                                              // J: Occupation
      data.emergencyContact?.name || '',                                  // K: Emergency Contact Name
      data.emergencyContact?.number || '',                                // L: Emergency Contact Number
      data.emergencyContact?.relationship || '',                          // M: Emergency Contact Relationship
      data.marathon?.category || '',                                      // N: Marathon Category
      data.marathon?.tshirt || '',                                        // O: T-Shirt Size
      data.marathon?.priorMarathon || '',                                 // P: Prior Marathon
      data.marathon?.priorEvents || '',                                   // Q: Prior Marathon Events
      data.health?.medicalCondition || '',                                // R: Medical Condition
      data.health?.medicalConditionDetail || '',                          // S: Medical Condition Detail
      data.health?.medication || '',                                      // T: Under Medication
      data.health?.medicationDetail || '',                                // U: Medication Detail
      data.health?.bloodGroup || '',                                      // V: Blood Group
      data.health?.fitnessConfirmed ? 'TRUE' : 'FALSE',                   // W: Fitness Confirmed
      data.fitness?.goal || '',                                           // X: Primary Fitness Goal
      data.fitness?.gymMember || '',                                      // Y: Gym Member
      data.fitness?.gymName || '',                                        // Z: Gym Name
      data.fitness?.freeAssessment || '',                                 // AA: Free Assessment
      data.fitness?.membershipInfo || '',                                 // AB: Membership Info
      data.fitness?.personalTraining || '',                               // AC: Personal Training
      data.marketing?.hearAbout || '',                                    // AD: How Did You Hear
      data.marketing?.referrerName || '',                                 // AE: Referrer Name
      data.consent?.waiver ? 'TRUE' : 'FALSE',                           // AF: Participation Waiver
      data.consent?.mediaConsent ? 'TRUE' : 'FALSE'                      // AG: Media Consent
    ];
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Registration saved!' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'alive', message: '619 Marathon Registration API is running. Use POST to submit.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
