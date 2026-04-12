const dateformat = require('dateformat');
const date = new Date(2026, 3, 12, 16, 4, 48); // April is index 3
console.log('Mask yyyyMMddHHmmss:', dateformat(date, 'yyyyMMddHHmmss'));
console.log('Mask yyyymmddHHmmss:', dateformat(date, 'yyyymmddHHmmss'));
