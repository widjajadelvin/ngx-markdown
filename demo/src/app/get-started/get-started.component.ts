import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  // standalone: true,
  imports: [MarkdownComponent],
})
export default class GetStartedComponent {
  headings: Element[] | undefined;

  markdown = ``;
  cdr = inject(ChangeDetectorRef);
  constructor() {
    this.iterate();
  }

  iterate() {
    const texts = `Based on your query for \"ME Spares suppliers,\" I have reviewed the search results and categorized the vendors into two distinct groups based on their 'synergyContracted' field and relevance to your query:\n\n1. Vendors with 'synergyContracted' as 'Yes':\n   - HYUNDAI GLOBAL SERVICES\n     - Services: Exclusive supplier of genuine parts for the HiMSEN Generator engine, spare parts for Main engines (ME/M.E), and supply of all Korean makers spares for auxiliary machinery.\n     - Location: Worldwide\n\n2. Vendors with 'synergyContracted' as 'No':\n   - DAIKAI ENGINEERING PTE LTD\n     - Services: Authorized Supplier for Engine Spares, Authorized Supplier for Various J-ENG (Japan Engine Company) Makers.\n     - Location: India\n\n   - DELTA CO.LTD\n     - Services: Engine Spare Parts Services, Machinery and Control Equipment Spare Parts, Supply Services for Ship Stores and Docking Materials, Spares for Purifiers and Air Compressors.\n     - Location: Japan\n\n   - DINTEC.CO.LTD\n     - Services: Engine Repair and Spare Parts Supply Services, Machinery and Equipment Supply Services, Supply of Ship, Navigational, and Medical Stores.\n     - Location: South Korea\n\n   - FUJI TRADING (SHANGHAI) COLTD.\n     - Services: Ship Supplies Services.\n     - Location: China, Japan\n\n   - FUJI TRADING CO.LTD\n     - Services: Supply of Spares for Various Equipment, Supply of Ship Stores.\n     - Location: Worldwide\n\n   - JAPAN MARINE (S) PTE.LTD.\n     - Services: Ship Spare Parts and Components Services, Manufacturing and Machining Services.\n     - Location: Singapore, Vietnam\n\n   - JINSAN MARINE MANAGEMENT CO. LTD.\n     - Services: Engine Services, Machinery and Equipment Services (T/C, COMPRESSORS, BOILER, PURIFIER).\n     - Location: South Korea\n\n   - RMS MARINE SERVICE\n     - Services: Fire Safety and Detection Systems Services (FFA, NK, MINIMAX, NOHMI, FGDS), Life Saving Appliances and Inspection Services (CSM, LALIZAS), Calibration and Technical Services (UTI, ROV).\n     - Location: Singapore, China, South Korea, UAE\n\n   - LIEF MARINE\n     - Services: Marine Services.\n     - Location: China\n\n   - MES TECHNOSERVICE CO LTD\n     - Services: Spare Parts Services, Support Services.\n     - Location: Japan\n\n   - CHONG LEE LEONG SENG CO LTD\n     - Services: Manufacturing and Distribution Services.\n     - Location: Singapore\n\n   - DAN MARINE GROUP LTD\n     - Services: Engine and Machinery Parts Supply Services, Repair and Overhaul Services, Specialized Ship Services.\n     - Location: China\n\n   - HANIL-FUJI CO LTD\n     - Services: Supply Services, Safety and Rescue Services (LSA, FFA).\n     - Location: South Korea\n\n   - J.O ENGINEERING CO LTD\n     - Services: Main and Auxiliary Engine Spares Supply Services, Retrofit and Overhaul Services, Miscellaneous Parts Supply Services.\n     - Location: South Korea\n\n   - LIAO YUAN MARINE SERVICE CO LTD\n     - Services: Marine Supplies.\n     - Location: China\n\n   - RMS MARINE SERVICE B.V\n     - Services: Ship Supplies Services.\n     - Location: Netherlands, Belgium\n\n   - STX HEAVY INDUSTRIES CO.LTD\n     - Services: Main Engine Spare Parts Supply, Turbocharger Spare Parts Supply.\n     - Location: Worldwide\n\n   - SUN OCEAN SERVICE CO LTD\n     - Services: Supply Services, Fabrication Services, Machinery Reconditioning Services.\n     - Location: South Korea\n\n   - KAWASAKI HEAVY INDUSTRIES LTD.\n     - Services: Marine Engine and Propulsion System Services, Steering and Deck Machinery Services, Auxiliary Engine and Boiler Services, Fishing Machinery Services.\n     - Location: Singapore\n\n   - JUNMA SERVICES PTE.LTD.\n     - Services: Main Engine Services (MC/MC-C/ME-C/ME-B, FIVA, HPS), Spare Parts Supply Services (MAN, Warstila, Rexroth, Nabco).\n     - Location: Singapore\n\nPlease note that the vendors in the first group are highly recommended as they have an established partnership with Synergy. However, the vendors in the second group can still meet your needs and should be considered as viable options.`;

    const split = texts.split(' ');
    let delay = 0;
    for (const word of split) {
      setTimeout(() => {
        this.markdown += word + ' ';
        this.cdr.detectChanges();
      }, 500 + delay);

      delay += 100;
    }
  }
}
// export default class GetStartedComponent implements AfterViewInit {
//   @ViewChild('markdownContainer', { static: true })
//   markdownContainer!: ElementRef<HTMLDivElement>;

//   ngAfterViewInit() {
//     this.iterate();
//   }

//   iterate() {
//     const texts = `Based on your query for "ME Spares suppliers," I have reviewed the search results and categorized the vendors into two distinct groups based on their 'synergyContracted' field and relevance to your query:

// 1. Vendors with 'synergyContracted' as 'Yes':
//    - HYUNDAI GLOBAL SERVICES
//      - Services: Exclusive supplier of genuine parts for the HiMSEN Generator engine, spare parts for Main engines (ME/M.E), and supply of all Korean makers spares for auxiliary machinery.
//      - Location: Worldwide

// 2. Vendors with 'synergyContracted' as 'No':
//    - DAIKAI ENGINEERING PTE LTD
//      - Services: Authorized Supplier for Engine Spares, Authorized Supplier for Various J-ENG (Japan Engine Company) Makers.
//      - Location: India

// Please note that the vendors in the first group are highly recommended as they have an established partnership with Synergy.`;

//     const split = texts.split(' ');
//     let delay = 0;

//     for (const word of split) {
//       setTimeout(() => {
//         // Create a new text node for each word and append it
//         // This doesn't modify existing text nodes, so selections are preserved
//         const textNode = document.createTextNode(word + ' ');
//         this.markdownContainer.nativeElement.appendChild(textNode);
//         console.log('Added word:', word);
//       }, 1000 + delay);

//       delay += 100;
//     }
//   }
// }
