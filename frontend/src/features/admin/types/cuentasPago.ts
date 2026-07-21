export interface CuentaPago {
  id_cuenta: number;
  tipo: 'yape' | 'transferencia';
  titular: string | null;
  numero: string | null;
  banco: string | null;
  cci: string | null;
  url_qr: string | null;
}