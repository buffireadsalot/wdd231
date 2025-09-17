// course.mjs
// Contains the course object and behavior for enrollment changes.

const byuiCourse = {
  title: "WDD 231: Web Frontend Development I",
  sections: [
    { id: "A1", enrolled: 24, capacity: 28, schedule: "MWF 10:00–10:50" },
    { id: "B2", enrolled: 28, capacity: 28, schedule: "TTh 09:30–10:45" },
    { id: "C3", enrolled: 12, capacity: 22, schedule: "Online, async" },
    { id: "D4", enrolled: 21, capacity: 24, schedule: "MWF 14:00–14:50" }
  ],

  /**
   * Enroll or drop a student from a specific section.
   * @param {string} sectionId - e.g. "A1"
   * @param {boolean} enroll - true to enroll, false to drop
   * @returns {{ok: boolean, message: string}}
   */
  changeEnrollment(sectionId, enroll = true) {
    const section = this.sections.find(s => String(s.id) === String(sectionId));
    if (!section) {
      return { ok: false, message: `Section ${sectionId} not found.` };
    }

    if (enroll) {
      if (section.enrolled >= section.capacity) {
        return { ok: false, message: `Section ${section.id} is already full.` };
      }
      section.enrolled += 1;
      return { ok: true, message: `Enrolled in section ${section.id}.` };
    }

    // drop
    if (section.enrolled <= 0) {
      return { ok: false, message: `No students to drop from ${section.id}.` };
    }
    section.enrolled -= 1;
    return { ok: true, message: `Dropped from section ${section.id}.` };
  }
};

export default byuiCourse;
