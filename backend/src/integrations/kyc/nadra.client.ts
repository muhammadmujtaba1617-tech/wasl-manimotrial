import { NadraCitizenRecord, NadraVerifyRequest, NadraVerifyResult } from './nadra.types.js';

export interface NadraConfig {
  apiUrl?: string;
  apiKey?: string;
  partnerCode?: string;
  certificateKey?: string;
  mockMode?: boolean;
}

export class NadraClient {
  private config: NadraConfig;

  constructor(config: NadraConfig = {}) {
    this.config = {
      apiUrl: config.apiUrl || process.env.NADRA_VERISYS_URL || 'https://api.nadra.gov.pk/verisys/v2',
      apiKey: config.apiKey || process.env.NADRA_API_KEY,
      partnerCode: config.partnerCode || process.env.NADRA_PARTNER_CODE || 'WASL_MATRIMONIAL',
      mockMode: config.mockMode ?? !process.env.NADRA_API_KEY
    };
  }

  normalizeCnic(cnic: string): string {
    const digits = cnic.replace(/\D/g, '');
    if (digits.length !== 13) {
      throw new Error(`Invalid Pakistani CNIC format: Expected 13 digits, got ${digits.length}`);
    }
    return `${digits.substring(0, 5)}-${digits.substring(5, 12)}-${digits.substring(12, 13)}`;
  }

  async verifyCnic(req: NadraVerifyRequest): Promise<NadraVerifyResult> {
    const timestamp = new Date().toISOString();
    const normalizedCnic = this.normalizeCnic(req.cnicNumber);
    const transactionId = `NADRA-TX-${Date.now()}-${Math.floor(Math.random() * 900000 + 100000)}`;

    if (this.config.mockMode) {
      // Deterministic Mock for dev/test:
      // If CNIC ends in '0' simulate failure for testing, otherwise verify
      const isSimulatedFailure = normalizedCnic.endsWith('0');
      if (isSimulatedFailure) {
        return {
          verified: false,
          matchScore: 30,
          cnicNormalized: normalizedCnic,
          failureReason: 'CNIC record not found or demographic mismatch in NADRA database',
          mismatches: ['FULL_NAME_MISMATCH'],
          transactionId,
          verifiedAt: timestamp
        };
      }

      return {
        verified: true,
        matchScore: 98,
        cnicNormalized: normalizedCnic,
        citizenRecord: {
          cnic: normalizedCnic,
          fullName: req.fullName.toUpperCase(),
          fatherName: req.fatherOrHusbandName ? req.fatherOrHusbandName.toUpperCase() : 'MOHAMMAD TARIQ',
          gender: req.gender || 'MALE',
          isAlive: true,
          maritalStatus: 'SINGLE',
          issuanceDate: '2020-01-15',
          expiryDate: '2030-01-15'
        },
        transactionId,
        verifiedAt: timestamp
      };
    }

    // In production with live NADRA biometric/verisys PKI gateway:
    try {
      const payload = {
        partner_code: this.config.partnerCode,
        cnic: normalizedCnic.replace(/-/g, ''),
        citizen_name: req.fullName,
        timestamp: Date.now()
      };

      const res = await fetch(`${this.config.apiUrl}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Nadra-Key': this.config.apiKey!
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        return {
          verified: false,
          matchScore: 0,
          cnicNormalized: normalizedCnic,
          failureReason: `NADRA service returned HTTP status ${res.status}`,
          transactionId,
          verifiedAt: timestamp
        };
      }

      const data: any = await res.json();
      return {
        verified: data.status === 'VERIFIED',
        matchScore: data.match_score || 95,
        cnicNormalized: normalizedCnic,
        citizenRecord: data.citizen_data,
        transactionId,
        verifiedAt: timestamp
      };
    } catch (err: any) {
      return {
        verified: false,
        matchScore: 0,
        cnicNormalized: normalizedCnic,
        failureReason: err?.message || 'Connection to NADRA Verisys Gateway timed out',
        transactionId,
        verifiedAt: timestamp
      };
    }
  }
}

export const defaultNadraClient = new NadraClient();
