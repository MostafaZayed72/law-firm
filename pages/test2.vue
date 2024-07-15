<template>
  <h1 @click="exportToDocx">Download</h1>
</template>

<script setup>
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from 'docx';
import { saveAs } from 'file-saver';

const exportToDocx = async () => {
  const tableData = [
    { file: '70-2024', consultant: 'أستاذ المكاشفي', result: '', requiredActions: 'تحضر وتقدم مذكرة دفاع ونطلب الحكم', previousDecision: 'وضعية القضية مؤجلة للجلسة 2024.07.15 لسماع', party: '', page: '', case: '', session: 'محكمة أبوظبي الاتحادية\nالساعة: 09:30\nرول 1\nنهائية الجلسات\nرابط الجلسة' },
    { file: '20-2024', consultant: 'أستاذ احمد يوسف', result: '', requiredActions: 'تحضر وتقدم مذكرة شارحة بأسباب الاستئناف', previousDecision: 'أول جلسة في الاستئناف 2024.07.15\nتم إعلان المستأنف عليه بواسطة البريد الإلكتروني', party: '', page: '', case: '', session: 'محكمة عجمان الاتحادية\nالساعة: 08:30\nرول 3\nدائرة الأسرة الاستئنافية الثالثة\nرابط الجلسة' },
    // أضف المزيد من البيانات حسب الحاجة
  ];

  const rows = tableData.map(row => new TableRow({
    children: [
      new TableCell({ children: [new Paragraph(row.file)] }),
      new TableCell({ children: [new Paragraph(row.consultant)] }),
      new TableCell({ children: [new Paragraph(row.result)] }),
      new TableCell({ children: [new Paragraph(row.requiredActions)] }),
      new TableCell({ children: [new Paragraph(row.previousDecision)] }),
      new TableCell({ children: [new Paragraph(row.party)] }),
      new TableCell({ children: [new Paragraph(row.page)] }),
      new TableCell({ children: [new Paragraph(row.case)] }),
      new TableCell({ children: [new Paragraph(row.session)] }),
    ]
  }));

  const table = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('الملف')] }),
          new TableCell({ children: [new Paragraph('المستشار')] }),
          new TableCell({ children: [new Paragraph('النتيجة')] }),
          new TableCell({ children: [new Paragraph('الإجراءات المطلوبة')] }),
          new TableCell({ children: [new Paragraph('القرار السابق')] }),
          new TableCell({ children: [new Paragraph('الطرف')] }),
          new TableCell({ children: [new Paragraph('الصفحة')] }),
          new TableCell({ children: [new Paragraph('القضية')] }),
          new TableCell({ children: [new Paragraph('الجلسة')] }),
        ]
      }),
      ...rows
    ],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  });

  const doc = new Document({
    sections: [{
      children: [table],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'table.docx');
};
</script>
