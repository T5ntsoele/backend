const { db } = require('./config/firebase');

const setupDemoData = async () => {
  try {
    console.log('🚀 Starting demo data setup...');

    // 1. Create Institutions
    const institutions = [
      {
        id: 'limkokwing',
        name: 'Limkokwing University of Creative Technology',
        location: 'Maseru, Lesotho',
        description: 'A leading creative technology university',
        contact: 'info@limkokwing.edu.ls',
        website: 'https://limkokwing.co.ls',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'nul',
        name: 'National University of Lesotho',
        location: 'Roma, Lesotho',
        description: 'Premier institution of higher learning in Lesotho',
        contact: 'info@nul.ls',
        website: 'https://nul.ls',
        isActive: true,
        createdAt: new Date()
      }
    ];

    for (const institution of institutions) {
      await db.collection('institutions').doc(institution.id).set(institution);
      console.log(`✅ Created institution: ${institution.name}`);
    }

    // 2. Create Faculties
    // First, delete existing faculties for limkokwing
    const existingFacultiesSnapshot = await db.collection('faculties').where('institutionId', '==', 'limkokwing').get();
    const deletePromises = [];
    existingFacultiesSnapshot.forEach(doc => {
      deletePromises.push(doc.ref.delete());
    });
    await Promise.all(deletePromises);
    console.log('🗑️ Deleted existing faculties for Limkokwing');

    const faculties = [
      {
        id: 'faculty_communication',
        institutionId: 'limkokwing',
        name: 'Faculty of Communication, Media and Broadcasting',
        description: 'This faculty prepares students to thrive in today\'s dynamic media landscape. With a focus on storytelling, production, and strategic communication, students gain hands-on experience across platforms such as television, radio, journalism, and digital media, while learning to craft messages that inform, engage, and inspire diverse audiences.',
        createdAt: new Date()
      },
      {
        id: 'faculty_business_global',
        institutionId: 'limkokwing',
        name: 'Faculty of Business Management and Globalisation',
        description: 'Students develop a strong foundation in global business strategy, leadership, and entrepreneurship. The curriculum combines real-world case studies with practical knowledge in finance, marketing, and operations. This faculty shapes future leaders equipped to navigate international markets, adapt to change, and drive innovation in the business world.',
        createdAt: new Date()
      },
      {
        id: 'faculty_tourism',
        institutionId: 'limkokwing',
        name: 'Faculty of Creativity in Tourism & Hospitality',
        description: 'Focusing on the creative side of service and experience design, this faculty prepares students for careers in travel, tourism, and hospitality management. Programmes combine customer experience strategy, event planning, and cultural understanding to equip graduates with the skills to thrive in a fast-evolving global industry.',
        createdAt: new Date()
      },
      {
        id: 'faculty_design_innovation',
        institutionId: 'limkokwing',
        name: 'Faculty of Design and Innovation',
        description: 'This faculty challenges students to push boundaries and solve problems through design. With emphasis on user experience, functionality, and aesthetics, the programme nurtures designers who can create meaningful, market-ready solutions across disciplines including product design, interior design, and industrial innovation.',
        createdAt: new Date()
      },
      {
        id: 'faculty_fashion',
        institutionId: 'limkokwing',
        name: 'Faculty of Fashion and Lifestyle Design',
        description: 'Students explore the creative and commercial aspects of the global fashion industry. From concept development to production and brand strategy, the curriculum nurtures innovative thinking and craftsmanship. Graduates emerge with the skills to create original fashion collections and lifestyle products for diverse global markets.',
        createdAt: new Date()
      },
      {
        id: 'faculty_ict',
        institutionId: 'limkokwing',
        name: 'Faculty of Information & Communication Technology',
        description: 'This faculty builds strong technical foundations in software development, networking, and data systems. Students gain practical experience in emerging tech such as cybersecurity, AI, and cloud computing. The programme is designed to produce adaptable, forward-thinking professionals ready to lead in the digital economy.',
        createdAt: new Date()
      },
      {
        id: 'faculty_architecture',
        institutionId: 'limkokwing',
        name: 'Faculty of Architecture and the Built Environment',
        description: 'This faculty explores the relationship between people, spaces, and structures. Students learn to design functional, sustainable environments through a blend of creative thinking and technical knowledge. The programme covers architectural theory, environmental planning, and building technology to prepare future professionals in the built environment industry.',
        createdAt: new Date()
      },
      {
        id: 'faculty_science',
        institutionId: 'nul',
        name: 'Faculty of Science & Technology',
        description: 'Science and technology programs',
        createdAt: new Date()
      }
    ];

    for (const faculty of faculties) {
      await db.collection('faculties').doc(faculty.id).set(faculty);
      console.log(`✅ Created faculty: ${faculty.name}`);
    }

    // 3. Create Courses
    // First, delete existing courses for limkokwing
    const existingCoursesSnapshot = await db.collection('courses').where('institutionId', '==', 'limkokwing').get();
    const deleteCoursePromises = [];
    existingCoursesSnapshot.forEach(doc => {
      deleteCoursePromises.push(doc.ref.delete());
    });
    await Promise.all(deleteCoursePromises);
    console.log('🗑️ Deleted existing courses for Limkokwing');

    const courses = [
      // Faculty of Communication, Media and Broadcasting
      {
        id: 'course_film_production_diploma',
        facultyId: 'faculty_communication',
        institutionId: 'limkokwing',
        name: 'Diploma in Film Production',
        description: 'Hands-on training in film production techniques, storytelling, and media creation.',
        requirements: ['High School Diploma', 'Creative portfolio', 'English proficiency'],
        duration: '2 years',
        credits: 60,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_broadcasting_radio_tv_diploma',
        facultyId: 'faculty_communication',
        institutionId: 'limkokwing',
        name: 'Diploma in Broadcasting Radio & TV',
        description: 'Comprehensive training in radio and television broadcasting techniques and production.',
        requirements: ['High School Diploma', 'Communication skills', 'English proficiency'],
        duration: '2 years',
        credits: 60,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_public_relations_diploma',
        facultyId: 'faculty_communication',
        institutionId: 'limkokwing',
        name: 'Diploma in Public Relations',
        description: 'Strategic communication and public relations management training.',
        requirements: ['High School Diploma', 'Communication skills', 'English proficiency'],
        duration: '2 years',
        credits: 60,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_journalism_media_diploma',
        facultyId: 'faculty_communication',
        institutionId: 'limkokwing',
        name: 'Diploma in Journalism & Media',
        description: 'Journalism fundamentals and media production skills.',
        requirements: ['High School Diploma', 'Writing skills', 'English proficiency'],
        duration: '2 years',
        credits: 60,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_digital_film_production_ba',
        facultyId: 'faculty_communication',
        institutionId: 'limkokwing',
        name: 'BA in Digital Film Production',
        description: 'Advanced digital film production and media creation.',
        requirements: ['High School Diploma', 'Portfolio', 'English proficiency'],
        duration: '3 years',
        credits: 90,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_broadcasting_journalism_ba',
        facultyId: 'faculty_communication',
        institutionId: 'limkokwing',
        name: 'BA in Broadcasting & Journalism',
        description: 'Comprehensive broadcasting and journalism degree program.',
        requirements: ['High School Diploma', 'Communication skills', 'English proficiency'],
        duration: '3 years',
        credits: 90,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_professional_communication_ba',
        facultyId: 'faculty_communication',
        institutionId: 'limkokwing',
        name: 'BA in Professional Communication',
        description: 'Professional communication and media management.',
        requirements: ['High School Diploma', 'Communication skills', 'English proficiency'],
        duration: '3 years',
        credits: 90,
        isActive: true,
        createdAt: new Date()
      },
      // Faculty of Business Management and Globalisation
      {
        id: 'course_retail_management_diploma',
        facultyId: 'faculty_business_global',
        institutionId: 'limkokwing',
        name: 'Diploma in Retail Management',
        description: 'Retail operations and management training.',
        requirements: ['High School Diploma', 'Mathematics', 'English proficiency'],
        duration: '2 years',
        credits: 60,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_marketing_diploma',
        facultyId: 'faculty_business_global',
        institutionId: 'limkokwing',
        name: 'Diploma in Marketing',
        description: 'Marketing principles and strategies training.',
        requirements: ['High School Diploma', 'Mathematics', 'English proficiency'],
        duration: '2 years',
        credits: 60,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_business_management_diploma',
        facultyId: 'faculty_business_global',
        institutionId: 'limkokwing',
        name: 'Diploma in Business Management',
        description: 'Business management fundamentals and operations.',
        requirements: ['High School Diploma', 'Mathematics', 'English proficiency'],
        duration: '2 years',
        credits: 60,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_international_business_bbus',
        facultyId: 'faculty_business_global',
        institutionId: 'limkokwing',
        name: 'B Bus in International Business',
        description: 'International business strategy and global market operations.',
        requirements: ['High School Diploma', 'Mathematics', 'English proficiency'],
        duration: '3 years',
        credits: 90,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_hr_management_ba',
        facultyId: 'faculty_business_global',
        institutionId: 'limkokwing',
        name: 'BA in Human Resource Management',
        description: 'Human resource management and organizational development.',
        requirements: ['High School Diploma', 'Mathematics', 'English proficiency'],
        duration: '3 years',
        credits: 90,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_entrepreneurship_bbus',
        facultyId: 'faculty_business_global',
        institutionId: 'limkokwing',
        name: 'B Bus in Entrepreneurship',
        description: 'Entrepreneurship and business innovation.',
        requirements: ['High School Diploma', 'Mathematics', 'English proficiency'],
        duration: '3 years',
        credits: 90,
        isActive: true,
        createdAt: new Date()
      },
      // Faculty of Creativity in Tourism & Hospitality
      {
        id: 'course_tourism_management_diploma',
        facultyId: 'faculty_tourism',
        institutionId: 'limkokwing',
        name: 'Diploma in Tourism Management',
        description: 'Tourism industry management and operations.',
        requirements: ['High School Diploma', 'English proficiency', 'Customer service orientation'],
        duration: '2 years',
        credits: 60,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_hotel_management_diploma',
        facultyId: 'faculty_tourism',
        institutionId: 'limkokwing',
        name: 'Diploma in Hotel Management',
        description: 'Hotel operations and hospitality management.',
        requirements: ['High School Diploma', 'English proficiency', 'Customer service orientation'],
        duration: '2 years',
        credits: 60,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_events_management_diploma',
        facultyId: 'faculty_tourism',
        institutionId: 'limkokwing',
        name: 'Diploma in Events Management',
        description: 'Event planning and management skills.',
        requirements: ['High School Diploma', 'English proficiency', 'Organizational skills'],
        duration: '2 years',
        credits: 60,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_tourism_management_ba',
        facultyId: 'faculty_tourism',
        institutionId: 'limkokwing',
        name: 'BA in Tourism Management',
        description: 'Advanced tourism management and sustainable tourism practices.',
        requirements: ['High School Diploma', 'English proficiency', 'Customer service orientation'],
        duration: '3 years',
        credits: 90,
        isActive: true,
        createdAt: new Date()
      },
      // Faculty of Design and Innovation
      {
        id: 'course_graphic_design_diploma',
        facultyId: 'faculty_design_innovation',
        institutionId: 'limkokwing',
        name: 'Diploma in Graphic Design',
        description: 'Graphic design principles and digital tools training.',
        requirements: ['High School Diploma', 'Creative portfolio', 'English proficiency'],
        duration: '2 years',
        credits: 60,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_creative_advertising_diploma',
        facultyId: 'faculty_design_innovation',
        institutionId: 'limkokwing',
        name: 'Diploma in Creative Advertising',
        description: 'Creative advertising and marketing communication.',
        requirements: ['High School Diploma', 'Creative thinking', 'English proficiency'],
        duration: '2 years',
        credits: 60,
        isActive: true,
        createdAt: new Date()
      },
      // Faculty of Fashion and Lifestyle Design
      {
        id: 'course_fashion_apparel_design_diploma',
        facultyId: 'faculty_fashion',
        institutionId: 'limkokwing',
        name: 'Diploma in Fashion & Apparel Design',
        description: 'Fashion design and apparel creation fundamentals.',
        requirements: ['High School Diploma', 'Creative portfolio', 'English proficiency'],
        duration: '2 years',
        credits: 60,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_fashion_retailing_ba',
        facultyId: 'faculty_fashion',
        institutionId: 'limkokwing',
        name: 'BA in Fashion & Retailing',
        description: 'Fashion industry and retail management.',
        requirements: ['High School Diploma', 'Creative portfolio', 'English proficiency'],
        duration: '3 years',
        credits: 90,
        isActive: true,
        createdAt: new Date()
      },
      // Faculty of Information & Communication Technology
      {
        id: 'course_multimedia_software_engineering_diploma',
        facultyId: 'faculty_ict',
        institutionId: 'limkokwing',
        name: 'Diploma in Multimedia & Software Engineering',
        description: 'Multimedia development and software engineering fundamentals.',
        requirements: ['High School Diploma', 'Mathematics', 'English proficiency'],
        duration: '2 years',
        credits: 60,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_information_technology_diploma',
        facultyId: 'faculty_ict',
        institutionId: 'limkokwing',
        name: 'Diploma in Information Technology',
        description: 'Information technology systems and applications.',
        requirements: ['High School Diploma', 'Mathematics', 'English proficiency'],
        duration: '2 years',
        credits: 60,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_business_it_diploma',
        facultyId: 'faculty_ict',
        institutionId: 'limkokwing',
        name: 'Diploma in Business Information Technology',
        description: 'Business applications of information technology.',
        requirements: ['High School Diploma', 'Mathematics', 'English proficiency'],
        duration: '2 years',
        credits: 60,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_software_engineering_multimedia_bsc',
        facultyId: 'faculty_ict',
        institutionId: 'limkokwing',
        name: 'BSc in Software Engineering with Multimedia',
        description: 'Software engineering with multimedia applications.',
        requirements: ['High School Diploma', 'Mathematics', 'English proficiency'],
        duration: '4 years',
        credits: 120,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_information_technology_bsc',
        facultyId: 'faculty_ict',
        institutionId: 'limkokwing',
        name: 'BSc in Information Technology',
        description: 'Comprehensive information technology degree.',
        requirements: ['High School Diploma', 'Mathematics', 'English proficiency'],
        duration: '4 years',
        credits: 120,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_business_it_bsc',
        facultyId: 'faculty_ict',
        institutionId: 'limkokwing',
        name: 'BSc in Business Information Technology',
        description: 'Business information systems and technology management.',
        requirements: ['High School Diploma', 'Mathematics', 'English proficiency'],
        duration: '4 years',
        credits: 120,
        isActive: true,
        createdAt: new Date()
      },
      // Faculty of Architecture and the Built Environment
      {
        id: 'course_architecture_technology_diploma',
        facultyId: 'faculty_architecture',
        institutionId: 'limkokwing',
        name: 'Diploma in Architecture Technology',
        description: 'Architectural technology and building systems.',
        requirements: ['High School Diploma', 'Mathematics', 'Technical drawing'],
        duration: '2 years',
        credits: 60,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'course_architectural_studies_bachelor',
        facultyId: 'faculty_architecture',
        institutionId: 'limkokwing',
        name: 'Bachelor of Architectural Studies',
        description: 'Architectural design and built environment studies.',
        requirements: ['High School Diploma', 'Mathematics', 'Technical drawing'],
        duration: '4 years',
        credits: 120,
        isActive: true,
        createdAt: new Date()
      },
      // NUL courses (keeping existing)
      {
        id: 'course_bsc_it',
        facultyId: 'faculty_science',
        institutionId: 'nul',
        name: 'BSc in Information Technology',
        description: 'IT degree with focus on systems analysis and database management.',
        requirements: ['High School Diploma', 'Mathematics', 'Computer Studies'],
        duration: '4 years',
        credits: 120,
        isActive: true,
        createdAt: new Date()
      }
    ];

    for (const course of courses) {
      await db.collection('courses').doc(course.id).set(course);
      console.log(`✅ Created course: ${course.name}`);
    }

    // 4. Create Companies
    const companies = [
      {
        id: 'company_tech',
        name: 'Tech Solutions Lesotho',
        email: 'info@techsolutions.ls',
        description: 'Leading technology company in Lesotho providing software development and IT services.',
        location: 'Maseru, Lesotho',
        industry: 'Technology',
        contact: '+266 1234 5678',
        website: 'https://techsolutions.ls',
        isApproved: true,
        status: 'active',
        createdAt: new Date()
      },
      {
        id: 'company_finance',
        name: 'Lesotho Financial Services',
        email: 'careers@lfs.ls',
        description: 'Financial services and banking institution serving Lesotho market.',
        location: 'Maseru, Lesotho',
        industry: 'Finance',
        contact: '+266 2234 5678',
        website: 'https://lfs.ls',
        isApproved: true,
        status: 'active',
        createdAt: new Date()
      },
      {
        id: 'company_telco',
        name: 'Vodacom Lesotho',
        email: 'hr@vodacom.co.ls',
        description: 'Leading telecommunications provider in Lesotho.',
        location: 'Maseru, Lesotho',
        industry: 'Telecommunications',
        contact: '+266 8000 0000',
        website: 'https://vodacom.co.ls',
        isApproved: true,
        status: 'active',
        createdAt: new Date()
      }
    ];

    for (const company of companies) {
      await db.collection('companies').doc(company.id).set(company);
      console.log(`✅ Created company: ${company.name}`);
    }

    // 5. Create Jobs
    const jobs = [
      {
        id: 'job_dev',
        companyId: 'company_tech',
        title: 'Junior Software Developer',
        description: 'We are looking for a passionate Junior Software Developer to design, develop and maintain software applications. Your primary focus will be to learn our codebase, gather user data, and respond to requests from senior developers.',
        requirements: ['JavaScript/TypeScript', 'Python/Java', 'Problem solving skills', 'Team collaboration'],
        qualifications: ['BSc in Computer Science or related field', 'Understanding of OOP', 'Basic database knowledge'],
        location: 'Maseru, Lesotho',
        salary: 'M10,000 - M15,000',
        jobType: 'full-time',
        requiredField: 'Computer Science',
        experienceLevel: 'entry',
        isActive: true,
        postedAt: new Date(),
        createdAt: new Date()
      },
      {
        id: 'job_analyst',
        companyId: 'company_finance',
        title: 'Business Analyst',
        description: 'Seeking a Business Analyst to help guide our business in improving processes, products, services and software through data analysis.',
        requirements: ['Analytical skills', 'Communication skills', 'Business process knowledge', 'Stakeholder management'],
        qualifications: ['BBA or related degree', '2+ years experience preferred', 'Certification in Business Analysis'],
        location: 'Maseru, Lesotho',
        salary: 'M12,000 - M18,000',
        jobType: 'full-time',
        requiredField: 'Business Administration',
        experienceLevel: 'mid',
        isActive: true,
        postedAt: new Date(),
        createdAt: new Date()
      },
      {
        id: 'job_network',
        companyId: 'company_telco',
        title: 'Network Engineer',
        description: 'Looking for a Network Engineer to design, implement, maintain, and support our growing network infrastructure.',
        requirements: ['Network configuration', 'Troubleshooting', 'Security protocols', 'Cisco technologies'],
        qualifications: ['BSc in Network Engineering or related', 'CCNA certification preferred', '2+ years experience'],
        location: 'Maseru, Lesotho',
        salary: 'M15,000 - M22,000',
        jobType: 'full-time',
        requiredField: 'Information Technology',
        experienceLevel: 'mid',
        isActive: true,
        postedAt: new Date(),
        createdAt: new Date()
      }
    ];

    for (const job of jobs) {
      await db.collection('jobs').doc(job.id).set(job);
      console.log(`✅ Created job: ${job.title}`);
    }

    console.log('\n🎉 Demo data setup completed successfully!');
    console.log('📊 Created:');
    console.log('   - 2 Institutions');
    console.log('   - 3 Faculties');
    console.log('   - 4 Courses');
    console.log('   - 3 Companies');
    console.log('   - 3 Job Postings');

  } catch (error) {
    console.error('❌ Error setting up demo data:', error.message);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  setupDemoData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = setupDemoData;