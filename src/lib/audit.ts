import { supabase } from './supabase';
import { UserProfile } from './auth';

export type AuditAction = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'complete'
  | 'upload_document'
  | 'login'
  | 'logout';

export type EntityType = 
  | 'proyecto'
  | 'hito'
  | 'documento'
  | 'aporte'
  | 'user';

export interface AuditEntry {
  user_id: string;
  user_email: string;
  action: AuditAction;
  entity_type: EntityType;
  entity_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
}

export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    const { error } = await supabase.from('audit_log').insert({
      user_id: entry.user_id,
      user_email: entry.user_email,
      action: entry.action,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id,
      details: entry.details,
      ip_address: entry.ip_address,
    });

    if (error) {
      console.error('Error logging audit:', error);
    }
  } catch (error) {
    console.error('Exception logging audit:', error);
  }
}

export async function logProjectAction(
  user: UserProfile,
  action: AuditAction,
  proyectoId: string,
  proyectoNombre: string,
  details?: Record<string, unknown>
): Promise<void> {
  await logAudit({
    user_id: user.id,
    user_email: user.email,
    action,
    entity_type: 'proyecto',
    entity_id: proyectoId,
    details: {
      proyecto_nombre: proyectoNombre,
      ...details,
    },
  });
}

export async function logMilestoneAction(
  user: UserProfile,
  action: AuditAction,
  hitoId: string,
  hitoTitulo: string,
  proyectoId: string,
  details?: Record<string, unknown>
): Promise<void> {
  await logAudit({
    user_id: user.id,
    user_email: user.email,
    action,
    entity_type: 'hito',
    entity_id: hitoId,
    details: {
      hito_titulo: hitoTitulo,
      proyecto_id: proyectoId,
      ...details,
    },
  });
}

export async function logDocumentAction(
  user: UserProfile,
  action: AuditAction,
  documentoId: string,
  documentoNombre: string,
  entityType: EntityType,
  entityId: string,
  details?: Record<string, unknown>
): Promise<void> {
  await logAudit({
    user_id: user.id,
    user_email: user.email,
    action,
    entity_type: entityType,
    entity_id: documentoId,
    details: {
      documento_nombre: documentoNombre,
      related_entity_id: entityId,
      ...details,
    },
  });
}
