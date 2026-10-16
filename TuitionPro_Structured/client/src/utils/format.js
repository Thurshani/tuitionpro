export const currency = (amount) => 'Rs. ' + Number(amount || 0).toLocaleString('en-LK');
export const initials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
export const monthLabel = (month) =>
  new Date(month + '-01T12:00:00').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
export const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
export const currentMonth = () => today().slice(0, 7);
export const calculateFees = (students, classes) =>
  students.reduce(
    (totals, student) => {
      const fee = Number(classes.find((item) => item.id === student.class_id)?.fee || 0);
      totals.expected += fee;
      totals[student.paid ? 'collected' : 'pending'] += fee;
      return totals;
    },
    { expected: 0, collected: 0, pending: 0 },
  );
